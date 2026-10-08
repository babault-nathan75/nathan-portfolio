import { neon } from "@neondatabase/serverless";

/** Client HTTP Neon, instancié une seule fois. */
function createBase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquant dans .env.local");
  return neon(url);
}

let baseClient: ReturnType<typeof createBase> | null = null;

function getBaseClient() {
  if (!baseClient) baseClient = createBase();
  return baseClient;
}

/**
 * Un échec « transitoire » est un problème de connexion réseau (cold start
 * Neon, coupure brève) : la requête n'a probablement jamais atteint le serveur,
 * donc un nouvel essai est sûr même pour un INSERT. Les autres erreurs
 * (contrainte, syntaxe…) ne sont pas retentées.
 */
function isTransient(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.message.includes("Error connecting to database")) return true;
  if (error.message === "fetch failed") return true;
  const code = (error as { cause?: { code?: string } }).cause?.code;
  if (typeof code === "string") {
    return /^(ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|EPIPE|UND_ERR)/.test(code);
  }
  return false;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransient(error) || i === attempts - 1) throw error;
      // Délai croissant : 250ms puis 500ms (absorbe un cold start)
      await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)));
    }
  }
  throw lastError;
}

/**
 * Client de requêtes avec nouvelle tentative automatique sur les erreurs
 * réseau transitoires (3 essais au total).
 */
function client() {
  const base = getBaseClient();
  const wrapped = ((strings: TemplateStringsArray, ...values: unknown[]) =>
    withRetry(() => base(strings, ...values))) as unknown as typeof base;
  wrapped.query = ((query: string, params?: unknown[]) =>
    withRetry(() => base.query(query, params))) as unknown as typeof wrapped.query;
  return wrapped;
}

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------
export type Profile = {
  first_name: string;
  tagline: string;
  expertise: string;
  location: string;
  available: boolean;
  available_text: string;
  cta_projects_label: string;
  cta_cv_label: string;
  contact_location: string;
  contact_availability: string;
  contact_email: string;
  contact_phone: string;
};

export type SocialLink = {
  id: number;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
};

export type Skill = {
  id: number;
  name: string;
  level: number;
  color: "blue" | "purple";
  sort_order: number;
};

export type Stat = {
  id: number;
  value: string;
  label_top: string;
  label_bottom: string;
  sort_order: number;
};

export type Experience = {
  id: number;
  type: "work" | "education";
  title: string;
  organization: string;
  date_label: string;
  description: string;
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string;
  link: string;
  status: "published" | "construction";
  sort_order: number;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type MediaKind = "photo" | "cv";

export type Media = {
  id: number;
  kind: MediaKind;
  filename: string;
  mime: string;
  size: number;
  data: string; // base64
};

// ---------------------------------------------------------------
// Lectures publiques
// ---------------------------------------------------------------
export async function getProfile(): Promise<Profile | null> {
  const rows = await client()`SELECT * FROM profile WHERE id = 1`;
  return (rows[0] as Profile) ?? null;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await client()`SELECT * FROM social_links ORDER BY sort_order, id`;
  return rows as unknown as SocialLink[];
}

export async function getSkills(): Promise<Skill[]> {
  const rows = await client()`SELECT * FROM skills ORDER BY sort_order, id`;
  return rows as unknown as Skill[];
}

export async function getStats(): Promise<Stat[]> {
  const rows = await client()`SELECT * FROM stats ORDER BY sort_order, id`;
  return rows as unknown as Stat[];
}

export async function getExperiences(): Promise<Experience[]> {
  const rows = await client()`SELECT * FROM experiences ORDER BY sort_order, id`;
  return rows as unknown as Experience[];
}

export async function getProjects(): Promise<Project[]> {
  const rows = await client()`SELECT * FROM projects ORDER BY sort_order, id`;
  return rows as unknown as Project[];
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await client()`SELECT key, value FROM settings`;
  const map: Record<string, string> = {};
  for (const row of rows as { key: string; value: string }[]) {
    map[row.key] = row.value;
  }
  return map;
}

export async function getMedia(kind: MediaKind): Promise<Media | null> {
  const rows = await client()`SELECT * FROM media WHERE kind = ${kind}`;
  return (rows[0] as Media) ?? null;
}

// ---------------------------------------------------------------
// Lectures admin
// ---------------------------------------------------------------
export async function getMessage(id: number): Promise<Message | null> {
  const rows = await client()`SELECT * FROM messages WHERE id = ${id}`;
  return (rows[0] as Message) ?? null;
}

export async function getMessages(): Promise<Message[]> {
  const rows = await client()`SELECT * FROM messages ORDER BY created_at DESC, id DESC`;
  return rows as unknown as Message[];
}

export async function countUnreadMessages(): Promise<number> {
  const rows = await client()`SELECT count(*)::int AS n FROM messages WHERE is_read = false`;
  return (rows[0] as { n: number }).n;
}

export async function getUserByEmail(email: string) {
  const rows = await client()`SELECT * FROM users WHERE email = ${email}`;
  return (rows[0] as { id: number; email: string; password_hash: string }) ?? null;
}

// ---------------------------------------------------------------
// Mutations (réservées aux Server Actions admin)
// ---------------------------------------------------------------
export async function updateProfile(p: Profile) {
  await client().query(
    `UPDATE profile SET first_name=$1, tagline=$2, expertise=$3, location=$4,
      available=$5, available_text=$6, cta_projects_label=$7, cta_cv_label=$8,
      contact_location=$9, contact_availability=$10, contact_email=$11, contact_phone=$12
     WHERE id = 1`,
    [
      p.first_name, p.tagline, p.expertise, p.location,
      p.available, p.available_text, p.cta_projects_label, p.cta_cv_label,
      p.contact_location, p.contact_availability, p.contact_email, p.contact_phone,
    ]
  );
}

export async function createSocialLink(label: string, url: string, icon: string) {
  const rows = await client()`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM social_links`;
  const next = (rows[0] as { next: number }).next;
  await client()`INSERT INTO social_links (label, url, icon, sort_order) VALUES (${label}, ${url}, ${icon}, ${next})`;
}

export async function updateSocialLink(id: number, label: string, url: string, icon: string) {
  await client()`UPDATE social_links SET label=${label}, url=${url}, icon=${icon} WHERE id = ${id}`;
}

export async function deleteSocialLink(id: number) {
  await client()`DELETE FROM social_links WHERE id = ${id}`;
}

export async function createSkill(name: string, level: number, color: string) {
  const rows = await client()`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM skills`;
  const next = (rows[0] as { next: number }).next;
  await client()`INSERT INTO skills (name, level, color, sort_order) VALUES (${name}, ${level}, ${color}, ${next})`;
}

export async function updateSkill(id: number, name: string, level: number, color: string) {
  await client()`UPDATE skills SET name=${name}, level=${level}, color=${color} WHERE id = ${id}`;
}

export async function deleteSkill(id: number) {
  await client()`DELETE FROM skills WHERE id = ${id}`;
}

export async function createStat(value: string, labelTop: string, labelBottom: string) {
  const rows = await client()`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM stats`;
  const next = (rows[0] as { next: number }).next;
  await client()`INSERT INTO stats (value, label_top, label_bottom, sort_order) VALUES (${value}, ${labelTop}, ${labelBottom}, ${next})`;
}

export async function updateStat(id: number, value: string, labelTop: string, labelBottom: string) {
  await client()`UPDATE stats SET value=${value}, label_top=${labelTop}, label_bottom=${labelBottom} WHERE id = ${id}`;
}

export async function deleteStat(id: number) {
  await client()`DELETE FROM stats WHERE id = ${id}`;
}

export async function createExperience(
  type: string, title: string, organization: string, dateLabel: string, description: string
) {
  const rows = await client()`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM experiences`;
  const next = (rows[0] as { next: number }).next;
  await client()`INSERT INTO experiences (type, title, organization, date_label, description, sort_order)
                 VALUES (${type}, ${title}, ${organization}, ${dateLabel}, ${description}, ${next})`;
}

export async function updateExperience(
  id: number, type: string, title: string, organization: string, dateLabel: string, description: string
) {
  await client()`UPDATE experiences SET type=${type}, title=${title}, organization=${organization},
                 date_label=${dateLabel}, description=${description} WHERE id = ${id}`;
}

export async function deleteExperience(id: number) {
  await client()`DELETE FROM experiences WHERE id = ${id}`;
}

export async function createProject(title: string, description: string, tags: string, link: string, status: string) {
  const rows = await client()`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM projects`;
  const next = (rows[0] as { next: number }).next;
  await client()`INSERT INTO projects (title, description, tags, link, status, sort_order)
                 VALUES (${title}, ${description}, ${tags}, ${link}, ${status}, ${next})`;
}

export async function updateProject(id: number, title: string, description: string, tags: string, link: string, status: string) {
  await client()`UPDATE projects SET title=${title}, description=${description}, tags=${tags},
                 link=${link}, status=${status} WHERE id = ${id}`;
}

export async function deleteProject(id: number) {
  await client()`DELETE FROM projects WHERE id = ${id}`;
}

export async function createMessage(name: string, email: string, message: string) {
  await client()`INSERT INTO messages (name, email, message) VALUES (${name}, ${email}, ${message})`;
}

export async function markMessageRead(id: number, isRead: boolean) {
  await client()`UPDATE messages SET is_read = ${isRead} WHERE id = ${id}`;
}

export async function deleteMessage(id: number) {
  await client()`DELETE FROM messages WHERE id = ${id}`;
}

export async function setSetting(key: string, value: string) {
  await client()`INSERT INTO settings (key, value) VALUES (${key}, ${value})
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}

export async function upsertMedia(kind: MediaKind, filename: string, mime: string, size: number, data: string) {
  await client()`INSERT INTO media (kind, filename, mime, size, data) VALUES (${kind}, ${filename}, ${mime}, ${size}, ${data})
                 ON CONFLICT (kind) DO UPDATE SET filename = EXCLUDED.filename, mime = EXCLUDED.mime,
                   size = EXCLUDED.size, data = EXCLUDED.data, created_at = now()`;
}

export async function deleteMedia(kind: MediaKind) {
  await client()`DELETE FROM media WHERE kind = ${kind}`;
}

export async function updateUserPassword(email: string, passwordHash: string) {
  await client()`UPDATE users SET password_hash = ${passwordHash} WHERE email = ${email}`;
}

/** Réordonne les lignes d'une table : reçoit la liste d'IDs dans l'ordre voulu. */
export async function reorderRows(table: "skills" | "experiences" | "projects" | "stats" | "social_links", ids: number[]) {
  const sql = client();
  for (let i = 0; i < ids.length; i++) {
    await sql.query(`UPDATE ${table} SET sort_order = $1 WHERE id = $2`, [i, ids[i]]);
  }
}

