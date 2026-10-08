/**
 * Test e2e du flux admin : login, protection, CRUD, messages.
 * Usage : node --env-file=.env.local scripts/_e2e-test.mjs (serveur requis sur PORT)
 */
const BASE = process.env.TEST_BASE_URL || "http://localhost:3100";

async function main() {
  const jar = new Map();

  function storeCookies(res) {
    const setCookies = res.headers.getSetCookie?.() ?? [];
    for (const c of setCookies) {
      const [pair] = c.split(";");
      const [name, ...rest] = pair.split("=");
      jar.set(name.trim(), rest.join("=").trim());
    }
  }

  function cookieHeader() {
    return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  async function get(path) {
    return fetch(BASE + path, {
      headers: jar.size ? { cookie: cookieHeader() } : {},
      redirect: "manual",
    });
  }

  async function postForm(path, form) {
    return fetch(BASE + path, {
      method: "POST",
      body: form,
      headers: { cookie: jar.size ? cookieHeader() : "" },
      redirect: "manual",
    });
  }

  /**
   * Extrait les inputs cachés ($ACTION_*) d'un fragment de formulaire précis.
   */
  function buildForm(formHtml, fields) {
    const form = new FormData();
    const inputs = [...formHtml.matchAll(/<input[^>]*type="hidden"[^>]*>/g)];
    for (const [tag] of inputs) {
      const name = tag.match(/name="([^"]*)"/)?.[1];
      if (!name) continue;
      if (name.startsWith("$ACTION_REF")) {
        form.set(name, "");
        continue;
      }
      const value = tag.match(/value="([^"]*)"/)?.[1] ?? "";
      form.set(name, value.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
    }
    for (const [k, v] of Object.entries(fields)) form.set(k, v);
    return form;
  }

  /** Découpe toutes les balises <form> d'une page. */
  function extractForms(html) {
    return [...html.matchAll(/<form[\s\S]*?<\/form>/g)].map((m) => m[0]);
  }

  const results = [];
  function check(name, ok, extra = "") {
    results.push({ name, ok, extra });
    console.log(`${ok ? "OK " : "KO "} ${name}${extra ? ` — ${extra}` : ""}`);
  }

  // 1. Site public rendu avec la BDD
  const home = await get("/");
  const homeHtml = await home.text();
  check("Public : accueil 200", home.status === 200);
  check("Public : projet BDD affiché", homeHtml.includes("Hebron-ivoire Shops"));
  check("Public : hero BDD affiché", homeHtml.includes("Disponible pour CDI"));

  // 2. Admin sans session → redirect login
  const adminNoAuth = await get("/admin");
  check(
    "Admin sans session → /admin/login",
    adminNoAuth.status === 307 && (adminNoAuth.headers.get("location") || "").includes("/admin/login")
  );

  // 3. Login : progressive enhancement (POST $ACTION_*)
  const loginPage = await get("/admin/login");
  const loginHtml = await loginPage.text();
  const loginFormHtml = extractForms(loginHtml).find((f) => f.includes('name="password"'));
  if (!loginFormHtml) {
    check("Login : formulaire trouvé", false);
    return finish();
  }

  const form = buildForm(loginFormHtml, {
    email: process.env.ADMIN_EMAIL || "nathan.babault@epitech.eu",
    password: process.env.ADMIN_PASSWORD || "Admin2026!",
  });

  const loginRes = await postForm("/admin/login", form);
  storeCookies(loginRes);
  const logged = jar.has("admin_session");
  check(
    "Login : succès (cookie admin_session)",
    logged && [200, 302, 303].includes(loginRes.status),
    `status=${loginRes.status}`
  );

  // 4-5. Pages admin accessibles
  const adminPage = await get("/admin");
  const adminHtml = await adminPage.text();
  check("Admin : tableau de bord 200", adminPage.status === 200);
  check("Admin : dashboard rendu", adminHtml.includes("Tableau de bord"));

  for (const path of ["/admin/projets", "/admin/competences", "/admin/parcours", "/admin/profil", "/admin/messages", "/admin/parametres"]) {
    const res = await get(path);
    check(`Admin : ${path} 200`, res.status === 200, `status=${res.status}`);
  }

  // 6. CRUD compétence : création → vérif publique → suppression
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);

  const skillsPage = await get("/admin/competences");
  const skillsHtml = await skillsPage.text();
  const createFormHtml = extractForms(skillsHtml).find((f) => f.includes('name="name"') && f.includes('Ajouter'));
  if (createFormHtml) {
    const createForm = buildForm(createFormHtml, {
      name: "TEST-SKILL-E2E",
      level: "42",
      color: "purple",
    });
    const createRes = await postForm("/admin/competences", createForm);
    check("CRUD : création compétence (303)", createRes.status === 303, `status=${createRes.status}`);

    const home2 = await get("/");
    const home2Html = await home2.text();
    check("CRUD : compétence visible publiquement", home2Html.includes("TEST-SKILL-E2E"));

    const rows = await sql`SELECT id FROM skills WHERE name = 'TEST-SKILL-E2E'`;
    check("CRUD : ligne en base", rows.length === 1);

    if (rows.length === 1) {
      const skillsPage2 = await get("/admin/competences");
      const skillsHtml2 = await skillsPage2.text();
      const delFormHtml = extractForms(skillsHtml2).find(
        (f) => f.includes(`name="id" value="${rows[0].id}"`) && f.includes("Supprimer")
      );
      check("CRUD : formulaire suppression trouvé", !!delFormHtml);
      if (delFormHtml) {
        const delForm = buildForm(delFormHtml, { id: String(rows[0].id) });
        const delRes = await postForm("/admin/competences", delForm);
        check("CRUD : suppression (303)", delRes.status === 303, `status=${delRes.status}`);
        const after = await sql`SELECT id FROM skills WHERE name = 'TEST-SKILL-E2E'`;
        check("CRUD : ligne supprimée", after.length === 0);
      }
    }
  } else {
    check("CRUD : formulaire création trouvé", false);
  }

  // 7. Message de contact public → table messages
  const contactFormHtml = extractForms(homeHtml).find((f) => f.includes('name="message"'));
  if (contactFormHtml) {
    const msgForm = buildForm(contactFormHtml, {
      name: "Test E2E",
      email: "test-e2e@example.com",
      message: "Message de test automatise pour valider la boite de reception admin.",
      company: "",
    });
    const msgRes = await postForm("/", msgForm);
    check("Contact : requête acceptée", [200, 303].includes(msgRes.status), `status=${msgRes.status}`);

    const msgs = await sql`SELECT id FROM messages WHERE email = 'test-e2e@example.com'`;
    check("Contact : message en base", msgs.length === 1);
    if (msgs.length === 1) {
      await sql`DELETE FROM messages WHERE id = ${msgs[0].id}`;
      console.log("     (message de test purgé)");
    }
  } else {
    check("Contact : formulaire trouvé", false);
  }

  return finish();

  function finish() {
    const failed = results.filter((r) => !r.ok);
    console.log(`\n${results.length - failed.length}/${results.length} tests OK`);
    if (failed.length) {
      console.log("Échecs:");
      for (const f of failed) console.log(`  - ${f.name} ${f.extra}`);
      process.exit(1);
    }
  }
}

main().catch((e) => {
  console.error("ERREUR:", e);
  process.exit(1);
});
