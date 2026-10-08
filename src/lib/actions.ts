"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, createSession, destroySession, verifyPassword, hashPassword } from "./auth";
import * as db from "./db";

/** Revalide le site public après toute mutation. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------
// Authentification
// ---------------------------------------------------------------
export type LoginState = { error?: string; ok?: boolean };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email et mot de passe requis." };

  let user;
  try {
    user = await db.getUserByEmail(email);
  } catch {
    // La base reste injoignable après les nouvelles tentatives : on évite un 500
    return { error: "Service momentanément indisponible, réessayez dans un instant." };
  }
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Identifiants invalides." };
  }

  await createSession(user.email);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next || !confirm) return { error: "Tous les champs sont requis." };
  if (next.length < 8) return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  if (next !== confirm) return { error: "Les mots de passe ne correspondent pas." };

  const user = await db.getUserByEmail(session.email);
  if (!user || !verifyPassword(current, user.password_hash)) {
    return { error: "Mot de passe actuel incorrect." };
  }

  await db.updateUserPassword(user.email, hashPassword(next));
  return { ok: true };
}

// ---------------------------------------------------------------
// Profil / Hero
// ---------------------------------------------------------------
export async function saveProfile(formData: FormData) {
  await requireAdmin();
  await db.updateProfile({
    first_name: String(formData.get("first_name") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    expertise: String(formData.get("expertise") ?? ""),
    location: String(formData.get("location") ?? ""),
    available: formData.get("available") === "on",
    available_text: String(formData.get("available_text") ?? ""),
    cta_projects_label: String(formData.get("cta_projects_label") ?? ""),
    cta_cv_label: String(formData.get("cta_cv_label") ?? ""),
    contact_location: String(formData.get("contact_location") ?? ""),
    contact_availability: String(formData.get("contact_availability") ?? ""),
    contact_email: String(formData.get("contact_email") ?? ""),
    contact_phone: String(formData.get("contact_phone") ?? ""),
  });
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

// ---------------------------------------------------------------
// Liens sociaux
// ---------------------------------------------------------------
export async function saveContact(formData: FormData) {
  await requireAdmin();
  const profile = await db.getProfile();
  if (!profile) return;
  await db.updateProfile({
    ...profile,
    contact_location: String(formData.get("contact_location") ?? ""),
    contact_availability: String(formData.get("contact_availability") ?? ""),
    contact_email: String(formData.get("contact_email") ?? ""),
    contact_phone: String(formData.get("contact_phone") ?? ""),
  });
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

export async function addSocialLink(formData: FormData) {
  await requireAdmin();
  await db.createSocialLink(
    String(formData.get("label") ?? ""),
    String(formData.get("url") ?? ""),
    String(formData.get("icon") ?? "globe")
  );
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

export async function saveSocialLink(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.updateSocialLink(
    id,
    String(formData.get("label") ?? ""),
    String(formData.get("url") ?? ""),
    String(formData.get("icon") ?? "globe")
  );
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

export async function removeSocialLink(formData: FormData) {
  await requireAdmin();
  await db.deleteSocialLink(Number(formData.get("id")));
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

// ---------------------------------------------------------------
// Compétences
// ---------------------------------------------------------------
function readSkill(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    level: Math.max(0, Math.min(100, Number(formData.get("level")) || 0)),
    color: String(formData.get("color") ?? "blue") === "purple" ? "purple" : "blue",
  };
}

export async function addSkill(formData: FormData) {
  await requireAdmin();
  const { name, level, color } = readSkill(formData);
  if (name) await db.createSkill(name, level, color);
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

export async function saveSkill(formData: FormData) {
  await requireAdmin();
  const { name, level, color } = readSkill(formData);
  await db.updateSkill(Number(formData.get("id")), name, level, color);
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

export async function removeSkill(formData: FormData) {
  await requireAdmin();
  await db.deleteSkill(Number(formData.get("id")));
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

// ---------------------------------------------------------------
// Stats circulaires
// ---------------------------------------------------------------
export async function addStat(formData: FormData) {
  await requireAdmin();
  const value = String(formData.get("value") ?? "");
  if (value) {
    await db.createStat(value, String(formData.get("label_top") ?? ""), String(formData.get("label_bottom") ?? ""));
  }
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

export async function saveStat(formData: FormData) {
  await requireAdmin();
  await db.updateStat(
    Number(formData.get("id")),
    String(formData.get("value") ?? ""),
    String(formData.get("label_top") ?? ""),
    String(formData.get("label_bottom") ?? "")
  );
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

export async function removeStat(formData: FormData) {
  await requireAdmin();
  await db.deleteStat(Number(formData.get("id")));
  revalidateSite();
  redirect("/admin/competences?saved=1");
}

// ---------------------------------------------------------------
// Parcours
// ---------------------------------------------------------------
function readExperience(formData: FormData) {
  return {
    type: String(formData.get("type")) === "work" ? "work" : "education",
    title: String(formData.get("title") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    dateLabel: String(formData.get("date_label") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function addExperience(formData: FormData) {
  await requireAdmin();
  const e = readExperience(formData);
  if (e.title) await db.createExperience(e.type, e.title, e.organization, e.dateLabel, e.description);
  revalidateSite();
  redirect("/admin/parcours?saved=1");
}

export async function saveExperience(formData: FormData) {
  await requireAdmin();
  const e = readExperience(formData);
  await db.updateExperience(Number(formData.get("id")), e.type, e.title, e.organization, e.dateLabel, e.description);
  revalidateSite();
  redirect("/admin/parcours?saved=1");
}

export async function removeExperience(formData: FormData) {
  await requireAdmin();
  await db.deleteExperience(Number(formData.get("id")));
  revalidateSite();
  redirect("/admin/parcours?saved=1");
}

// ---------------------------------------------------------------
// Projets
// ---------------------------------------------------------------
function readProject(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    link: String(formData.get("link") ?? ""),
    status: String(formData.get("status")) === "construction" ? "construction" : "published",
  };
}

export async function addProject(formData: FormData) {
  await requireAdmin();
  const p = readProject(formData);
  if (p.title) await db.createProject(p.title, p.description, p.tags, p.link, p.status);
  revalidateSite();
  redirect("/admin/projets?saved=1");
}

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const p = readProject(formData);
  await db.updateProject(Number(formData.get("id")), p.title, p.description, p.tags, p.link, p.status);
  revalidateSite();
  redirect("/admin/projets?saved=1");
}

export async function removeProject(formData: FormData) {
  await requireAdmin();
  await db.deleteProject(Number(formData.get("id")));
  revalidateSite();
  redirect("/admin/projets?saved=1");
}

// ---------------------------------------------------------------
// Messages
// ---------------------------------------------------------------
export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const isRead = formData.get("is_read") === "true";
  await db.markMessageRead(id, isRead);
  redirect("/admin/messages");
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  await db.deleteMessage(Number(formData.get("id")));
  redirect("/admin/messages");
}

// ---------------------------------------------------------------
// Paramètres
// ---------------------------------------------------------------
export async function saveSettings(formData: FormData) {
  await requireAdmin();
  await db.setSetting("site_title", String(formData.get("site_title") ?? ""));
  await db.setSetting("site_description", String(formData.get("site_description") ?? ""));
  await db.setSetting("footer_text", String(formData.get("footer_text") ?? ""));
  await db.setSetting("formspree_url", String(formData.get("formspree_url") ?? ""));
  await db.setSetting("maintenance", formData.get("maintenance") === "on" ? "true" : "false");
  revalidateSite();
  redirect("/admin/parametres?saved=1");
}

// ---------------------------------------------------------------
// Uploads (photo / CV) — stockés en base64 dans la table media
// ---------------------------------------------------------------
const MEDIA_LIMITS: Record<db.MediaKind, { mimes: string[]; max: number }> = {
  photo: { mimes: ["image/png", "image/jpeg", "image/webp"], max: 4 * 1024 * 1024 },
  cv: { mimes: ["application/pdf"], max: 4 * 1024 * 1024 },
};

async function saveUpload(kind: db.MediaKind, formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Aucun fichier sélectionné." };

  const limits = MEDIA_LIMITS[kind];
  if (!limits.mimes.includes(file.type)) {
    return { error: kind === "cv" ? "Le CV doit être un PDF." : "Photo : PNG, JPEG ou WebP uniquement." };
  }
  if (file.size > limits.max) return { error: "Fichier trop volumineux (max 4 Mo)." };

  const buffer = Buffer.from(await file.arrayBuffer());
  await db.upsertMedia(kind, file.name, file.type, file.size, buffer.toString("base64"));
  revalidateSite();
  return {};
}

export async function uploadPhoto(_prev: LoginState, formData: FormData): Promise<LoginState> {
  return saveUpload("photo", formData);
}

export async function uploadCv(_prev: LoginState, formData: FormData): Promise<LoginState> {
  return saveUpload("cv", formData);
}

export async function removeMedia(formData: FormData) {
  await requireAdmin();
  const kind = String(formData.get("kind")) === "cv" ? "cv" : "photo";
  await db.deleteMedia(kind);
  revalidateSite();
  redirect("/admin/profil?saved=1");
}

// ---------------------------------------------------------------
// Formulaire de contact public
// ---------------------------------------------------------------
export type ContactState = { ok?: boolean; error?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "");

  if (honeypot) return { ok: true }; // piège à robots
  if (!name || !email || !message) return { error: "Tous les champs sont requis." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Adresse email invalide." };
  if (message.length < 10) return { error: "Le message est trop court." };

  // Enregistre en base (boîte de réception admin)
  try {
    await db.createMessage(name, email, message);
  } catch (e) {
    console.error("Échec d'enregistrement du message:", e);
  }

  // Best-effort : notification Formspree conservée
  try {
    const settings = await db.getSettings();
    const endpoint = settings.formspree_url;
    if (endpoint) {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
    }
  } catch (e) {
    console.error("Échec d'envoi Formspree (message conservé en base):", e);
  }

  return { ok: true };
}


