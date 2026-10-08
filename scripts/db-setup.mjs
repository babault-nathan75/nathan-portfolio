/**
 * Crée le schéma de la base Neon et le remplit avec les données actuelles
 * du portfolio (idempotent : relisible sans risque).
 *
 * Usage : npm run db:setup
 */
import { neon } from "@neondatabase/serverless";
import { scryptSync, randomBytes } from "node:crypto";

const sql = neon(process.env.DATABASE_URL);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `${salt}:${hash}`;
}

// ---------------------------------------------------------------
// 1. Schéma
// ---------------------------------------------------------------
const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS profile (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    first_name TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    expertise TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    available BOOLEAN NOT NULL DEFAULT true,
    available_text TEXT NOT NULL DEFAULT '',
    cta_projects_label TEXT NOT NULL DEFAULT 'Voir mes projets',
    cta_cv_label TEXT NOT NULL DEFAULT 'Télécharger mon CV',
    contact_location TEXT NOT NULL DEFAULT '',
    contact_availability TEXT NOT NULL DEFAULT '',
    contact_email TEXT NOT NULL DEFAULT '',
    contact_phone TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'globe',
    sort_order INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level INT NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
    color TEXT NOT NULL DEFAULT 'blue' CHECK (color IN ('blue', 'purple')),
    sort_order INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    label_top TEXT NOT NULL,
    label_bottom TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('work', 'education')),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    date_label TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'construction')),
    sort_order INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    kind TEXT UNIQUE NOT NULL CHECK (kind IN ('photo', 'cv')),
    filename TEXT NOT NULL,
    mime TEXT NOT NULL,
    size INT NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )`,
];

for (const statement of schema) {
  await sql.query(statement);
}

// ---------------------------------------------------------------
// 2. Seed (seulement si la base est vide)
// ---------------------------------------------------------------
const [{ count }] = await sql`SELECT count(*)::int AS count FROM users`;

if (count > 0) {
  console.log("La base est déjà initialisée, aucun seed effectué.");
  process.exit(0);
}

// --- Admin ---
const adminEmail = process.env.ADMIN_EMAIL || "nathan.babault@epitech.eu";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin2026!";
await sql`INSERT INTO users (email, password_hash) VALUES (${adminEmail}, ${hashPassword(adminPassword)})`;
console.log(`Compte admin créé : ${adminEmail}`);

// --- Profil / Hero ---
await sql`INSERT INTO profile (
  first_name, tagline, expertise, location, available, available_text,
  cta_projects_label, cta_cv_label,
  contact_location, contact_availability, contact_email, contact_phone
) VALUES (
  'BABAULT Nathan Charles',
  'Développeur Full-Stack basé à Abidjan. Je conçois des applications web et mobiles robustes avec une expertise sur',
  'Laravel, SQL, MongoDB, TailwindCSS, PHP, React, Next.js, Supabase et Python',
  'Yopougon, Abidjan',
  true,
  'Disponible pour CDI & Freelance',
  'Voir mes projets',
  'Télécharger mon CV',
  'Yopougon, Abidjan',
  'Disponible en présentiel et télétravail',
  'nathan.babault@epitech.eu',
  '+225 01 03 57 30 23'
)`;

// --- Liens sociaux ---
const socials = [
  ["GitHub", "https://github.com/babault-nathan75", "github", 0],
  ["LinkedIn", "https://www.linkedin.com/in/nathan-babault-a57207372/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", "linkedin", 1],
  ["Email", "mailto:nathan.babault@epitech.eu", "mail", 2],
];
for (const [label, url, icon, sort_order] of socials) {
  await sql`INSERT INTO social_links (label, url, icon, sort_order) VALUES (${label}, ${url}, ${icon}, ${sort_order})`;
}

// --- Compétences ---
const skills = [
  ["HTML", 88, "blue"], ["CSS", 75, "blue"], ["Laravel", 65, "blue"],
  ["PHP", 70, "blue"], ["JavaScript", 80, "blue"], ["REACT", 87, "blue"],
  ["NEXT.JS", 91, "blue"], ["NODE.JS", 74, "purple"], ["PYTHON", 70, "purple"],
  ["GitHub", 88, "purple"], ["SUPABASE", 75, "purple"], ["MONGODB", 80, "purple"],
  ["TAILWIND CSS", 86, "purple"], ["SQL", 90, "purple"], ["FIGMA", 73, "purple"],
];
let order = 0;
for (const [name, level, color] of skills) {
  await sql`INSERT INTO skills (name, level, color, sort_order) VALUES (${name}, ${level}, ${color}, ${order})`;
  order += 1;
}

// --- Stats circulaires ---
await sql`INSERT INTO stats (value, label_top, label_bottom, sort_order) VALUES ('02', 'Années', 'Expériences', 0)`;
await sql`INSERT INTO stats (value, label_top, label_bottom, sort_order) VALUES ('plusieurs', 'Projets', 'Réalisés', 1)`;

// --- Parcours ---
const experiences = [
  ["education", "Attestation de formation en développement FULL-STACK", "WECODE, GIZ, FORPRODE, EPITECH", "2026", "Spécialisation dans le développement web moderne (Front-end et Back-end)."],
  ["work", "Stage en informatique (06 Mois)", "Centre National de Transfusion Sanguine de Côte d’Ivoire", "2025", "Conception d'application web local, Assistance Technique et Collection de données."],
  ["education", "BTS Informatique Développeur d'Application", "Institut de Formation Sainte Marie, Abidjan", "2023 - 2024", "Formation technique approfondie en développement d'applications."],
  ["education", "Baccalauréat D", "Groupe Scolaire Israël, Bonoua", "2021 - 2022", "Série scientifique."],
];
order = 0;
for (const [type, title, organization, dateLabel, description] of experiences) {
  await sql`INSERT INTO experiences (type, title, organization, date_label, description, sort_order)
            VALUES (${type}, ${title}, ${organization}, ${dateLabel}, ${description}, ${order})`;
  order += 1;
}

// --- Projets ---
const projects = [
  ["Hebron-ivoire Shops", "Plateforme e-commerce multiservices intégrant une boutique générale, une librairie chrétienne (avec gestion de TVA complexe) et un service de réservation/commande de repas.", "Next.js, E-commerce, UI/UX, MongoDB", "https://hebronivoireshops.com", "published"],
  ["Esther Bella Fashion", "Création d'une boutique en ligne pour une marque de mode basée à Abidjan. Focus particulier sur l'optimisation SEO, la génération de sitemap et l'expérience utilisateur.", "React, SEO, E-commerce, MongoDB", "https://esther-bella-shop.vercel.app/", "published"],
  ["Bio Medical", "Site web permettant d'accéder à des médicaments de Yupi global. Développement complet de l'interface et intégration du backend.", "Next.js, Mobile/desktop, UI/UX, MongoDB", "https://bio-medical-babaults-projects.vercel.app/", "published"],
  ["Rotten Tomatoes", "Site web permettant d'accéder au notes des films. Développement complet de l'interface et intégration du backend.", "Next.js, Mobile/desktop, UI/UX, MongoDB", "https://movies-tomatoe.vercel.app/", "published"],
  ["T-KAI Shop", "Site web permettant d'acheter des tee-shirts personnalisés mangas. Développement complet de l'interface et intégration du backend.", "Next.js, Mobile/desktop, UI/UX, postgreSQL", "https://tkai-shop.vercel.app/", "published"],
  ["Secrétariat Pro", "Site web de mise en relation entre professionnels du secrétariat et clients/entreprises. Développement complet de l'interface et intégration du backend.", "Next.js, Mobile/desktop, UI/UX, Supabase", "https://secretariatpro-drab.vercel.app/", "published"],
  ["Formation Word Excel", "Plateforme de formation en ligne pour les logiciels Word et Excel. Développement complet de l'interface et intégration du backend.", "Next.js, Mobile/desktop, UI/UX, Supabase", "https://formation-word-excel.vercel.app/", "published"],
  ["YOWL", "Plateforme de publication de contenu libre. Développement de bout en bout (Front-end et Back-end) du système de publications et de gestion des liens.", "Laravel, PHP, Full-Stack", "", "construction"],
  ["EPICTURE", "Clone mobile de l'application Trello. Développement complet des workspaces, gestion d'état et synchronisation avec le backend.", "React Native, Mobile, API", "", "construction"],
  ["EBIZ", "ERP de gestion d'entreprise. Développement complet des workspaces, gestion d'état et synchronisation avec le backend.", "Next.js, Python, Mobile/Desktop, UI/UX, API, PostgreSQL", "", "construction"],
];
order = 0;
for (const [title, description, tags, link, status] of projects) {
  await sql`INSERT INTO projects (title, description, tags, link, status, sort_order)
            VALUES (${title}, ${description}, ${tags}, ${link}, ${status}, ${order})`;
  order += 1;
}

// --- Paramètres ---
const settings = [
  ["site_title", "BABAULT Nathan | Développeur Full-Stack"],
  ["site_description", "Portfolio de Nathan BABAULT, Développeur Full-Stack spécialisé en solutions web et mobiles."],
  ["footer_text", "Fait avec Next.js & Tailwind CSS."],
  ["maintenance", "false"],
  ["formspree_url", "https://formspree.io/f/xbdzvlwr"],
];
for (const [key, value] of settings) {
  await sql`INSERT INTO settings (key, value) VALUES (${key}, ${value})`;
}

console.log("Seed terminé : profil, compétences, parcours, projets et paramètres insérés.");
