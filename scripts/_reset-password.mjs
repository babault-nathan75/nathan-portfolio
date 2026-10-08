import { neon } from "@neondatabase/serverless";
import { scryptSync, randomBytes } from "node:crypto";

/** Réinitialise le mot de passe admin à la valeur de ADMIN_PASSWORD (.env.local). */
const sql = neon(process.env.DATABASE_URL);

const password = process.env.ADMIN_PASSWORD;
const email = process.env.ADMIN_EMAIL || "nathan.babault@epitech.eu";
if (!password) {
  console.error("ADMIN_PASSWORD manquant dans .env.local");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");

const rows = await sql`UPDATE users SET password_hash = ${`${salt}:${hash}`} WHERE email = ${email} RETURNING id`;
if (rows.length === 0) {
  console.error(`Aucun utilisateur ${email}`);
  process.exit(1);
}
console.log(`Mot de passe réinitialisé pour ${email}`);
