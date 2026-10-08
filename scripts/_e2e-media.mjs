import { neon } from "@neondatabase/serverless";

/** Test e2e : upload photo/CV → service /api/media → suppression. */
const BASE = "http://localhost:3100";
const sql = neon(process.env.DATABASE_URL);
const jar = new Map();

const results = [];
function check(name, ok, extra = "") {
  results.push(ok);
  console.log(`${ok ? "OK " : "KO "} ${name}${extra ? ` — ${extra}` : ""}`);
}

function storeCookies(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const [name, ...rest] = pair.split("=");
    jar.set(name.trim(), rest.join("=").trim());
  }
}
const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

async function get(path) {
  return fetch(BASE + path, { headers: { cookie: cookieHeader() }, redirect: "manual" });
}

function buildForm(formHtml, fields) {
  const form = new FormData();
  for (const [tag] of [...formHtml.matchAll(/<input[^>]*type="hidden"[^>]*>/g)]) {
    const name = tag.match(/name="([^"]*)"/)?.[1];
    if (!name) continue;
    if (name.startsWith("$ACTION_REF")) { form.set(name, ""); continue; }
    form.set(name, (tag.match(/value="([^"]*)"/)?.[1] ?? "").replace(/&quot;/g, '"'));
  }
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return form;
}

const extractForms = (html) => [...html.matchAll(/<form[\s\S]*?<\/form>/g)].map((m) => m[0]);

// --- Login ---
const loginPage = await fetch(BASE + "/admin/login");
const loginHtml = await loginPage.text();
const loginForm = extractForms(loginHtml).find((f) => f.includes('name="password"'));
const loginData = buildForm(loginForm, { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
storeCookies(await fetch(BASE + "/admin/login", { method: "POST", body: loginData, redirect: "manual" }));
check("Login", jar.has("admin_session"));

// --- Page profil ---
const profilPage = await get("/admin/profil");
const profilHtml = await profilPage.text();
check("Page profil 200", profilPage.status === 200);

// --- Upload photo (petit PNG 1x1) ---
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);
const uploadFormHtml = extractForms(profilHtml).find((f) => f.includes('name="file"') && f.includes("Photo"));
check("Formulaire upload photo trouvé", !!uploadFormHtml);

if (uploadFormHtml) {
  const uploadForm = buildForm(uploadFormHtml, {});
  uploadForm.set("file", new File([png], "test-photo.png", { type: "image/png" }));
  const uploadRes = await fetch(BASE + "/admin/profil", { method: "POST", body: uploadForm, headers: { cookie: cookieHeader() }, redirect: "manual" });
  check("Upload photo accepté", [200, 303].includes(uploadRes.status), `status=${uploadRes.status}`);

  const rows = await sql`SELECT id, mime, size FROM media WHERE kind = 'photo'`;
  check("Photo en base", rows.length === 1 && rows[0].mime === "image/png");

  // --- Service /api/media/photo ---
  const mediaRes = await get("/api/media/photo");
  const buf = Buffer.from(await mediaRes.arrayBuffer());
  check("GET /api/media/photo 200", mediaRes.status === 200);
  check("Content-Type image/png", (mediaRes.headers.get("content-type") || "").includes("image/png"));
  check("Contenu identique au fichier uploadé", buf.equals(png));

  // Fallback côté page publique : l'URL /api/media/photo est utilisée
  const home = await fetch(BASE + "/");
  const homeHtml = await home.text();
  check("Accueil référence /api/media/photo", homeHtml.includes("/api/media/photo"));

  // --- Suppression via removeMedia ---
  const profilPage2 = await get("/admin/profil");
  const profilHtml2 = await profilPage2.text();
  const delFormHtml = extractForms(profilHtml2).find(
    (f) => f.includes('name="kind"') && /value="photo"/.test(f) && f.includes("Supprimer")
  );
  check("Formulaire suppression photo trouvé", !!delFormHtml);
  if (delFormHtml) {
    const delForm = buildForm(delFormHtml, { kind: "photo" });
    const delRes = await fetch(BASE + "/admin/profil", { method: "POST", body: delForm, headers: { cookie: cookieHeader() }, redirect: "manual" });
    check("Suppression photo (303)", delRes.status === 303, `status=${delRes.status}`);
    const after = await sql`SELECT id FROM media WHERE kind = 'photo'`;
    check("Photo supprimée de la base", after.length === 0);
  }
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} tests OK`);
process.exit(failed ? 1 : 0);
