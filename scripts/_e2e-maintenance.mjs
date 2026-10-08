import { neon } from "@neondatabase/serverless";

/** Test : bascule maintenance via l'action admin (revalidatePath inclus). */
const BASE = "http://localhost:3100";
const sql = neon(process.env.DATABASE_URL);
const jar = new Map();

const results = [];
const check = (name, ok, extra = "") => {
  results.push(ok);
  console.log(`${ok ? "OK " : "KO "} ${name}${extra ? ` — ${extra}` : ""}`);
};

function storeCookies(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const [name, ...rest] = pair.split("=");
    jar.set(name.trim(), rest.join("=").trim());
  }
}
const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
const buildForm = (formHtml, fields) => {
  const form = new FormData();
  for (const [tag] of [...formHtml.matchAll(/<input[^>]*type="hidden"[^>]*>/g)]) {
    const name = tag.match(/name="([^"]*)"/)?.[1];
    if (!name) continue;
    if (name.startsWith("$ACTION_REF")) { form.set(name, ""); continue; }
    form.set(name, (tag.match(/value="([^"]*)"/)?.[1] ?? "").replace(/&quot;/g, '"'));
  }
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return form;
};
const extractForms = (html) => [...html.matchAll(/<form[\s\S]*?<\/form>/g)].map((m) => m[0]);

// Login
const loginHtml = await (await fetch(BASE + "/admin/login")).text();
const loginForm = extractForms(loginHtml).find((f) => f.includes('name="password"'));
storeCookies(
  await fetch(BASE + "/admin/login", {
    method: "POST",
    body: buildForm(loginForm, { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
    redirect: "manual",
  })
);
check("Login", jar.has("admin_session"));

async function setMaintenance(on) {
  const page = await fetch(BASE + "/admin/parametres", { headers: { cookie: cookieHeader() } });
  const html = await page.text();
  const formHtml = extractForms(html).find((f) => f.includes('name="site_title"'));
  const form = buildForm(formHtml, {
    site_title: "BABAULT Nathan | Développeur Full-Stack",
    site_description: "Portfolio de Nathan BABAULT, Développeur Full-Stack spécialisé en solutions web et mobiles.",
    footer_text: "Fait avec Next.js & Tailwind CSS.",
    formspree_url: "https://formspree.io/f/xbdzvlwr",
  });
  if (on) form.set("maintenance", "on");
  const res = await fetch(BASE + "/admin/parametres", {
    method: "POST",
    body: form,
    headers: { cookie: cookieHeader() },
    redirect: "manual",
  });
  return res.status;
}

// Activation via l'action admin
const st1 = await setMaintenance(true);
check("Action settings ON (303)", st1 === 303, `status=${st1}`);
const row1 = await sql`SELECT value FROM settings WHERE key = 'maintenance'`;
check("Base: maintenance=true", row1[0].value === "true");

const res1 = await fetch(BASE + "/", { headers: { "cache-control": "no-cache" } });
const html1 = await res1.text();
check("Accueil: bandeau maintenance affiché", html1.includes("Le site est en maintenance"));
check("Accueil: projets masqués", !html1.includes("Hebron-ivoire Shops"));

// Désactivation via l'action admin
const st2 = await setMaintenance(false);
check("Action settings OFF (303)", st2 === 303, `status=${st2}`);
const row2 = await sql`SELECT value FROM settings WHERE key = 'maintenance'`;
check("Base: maintenance=false", row2[0].value === "false");

const res2 = await fetch(BASE + "/", { headers: { "cache-control": "no-cache" } });
const html2 = await res2.text();
check("Accueil: contenu rétabli", html2.includes("Hebron-ivoire Shops"));
check("Accueil: bandeau absent", !html2.includes("Le site est en maintenance"));

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} tests OK`);
process.exit(failed ? 1 : 0);
