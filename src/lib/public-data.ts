import "server-only";
import { cache } from "react";
import {
  getProfile,
  getSocialLinks,
  getSkills,
  getStats,
  getExperiences,
  getProjects,
  getSettings,
  getMedia,
} from "./db";
import {
  fallbackProfile,
  fallbackProjects,
  fallbackSocials,
  fallbackSkills,
  fallbackSettings,
  fallbackStats,
  fallbackExperiences,
} from "./data";
import type { Media } from "./db";

/** Forme normalisée d'un projet pour l'affichage public. */
export type PublicProject = {
  id: number;
  title: string;
  description: string;
  tags: string; // « Next.js, UI/UX »
  link: string;
  status: "published" | "construction";
};

export type PublicData = {
  profile: typeof fallbackProfile;
  socials: typeof fallbackSocials;
  skills: typeof fallbackSkills;
  stats: typeof fallbackStats;
  experiences: typeof fallbackExperiences;
  projects: PublicProject[];
  settings: Record<string, string>;
  photo: Media | null;
  cv: Media | null;
  /** true si la base a répondu, false si repli sur les données statiques */
  fromDatabase: boolean;
};

/** Le fallback historique utilise tags[] + link « /en-construction ». */
function normalizeFallbackProjects(): PublicProject[] {
  return fallbackProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags.join(", "),
    link: p.link,
    status: p.link === "/en-construction" ? "construction" : "published",
  }));
}

/**
 * Charge toutes les données publiques. Mémoïsée par requête React (le layout
 * et la page partagent le même résultat → 9 requêtes au lieu de 18).
 * En cas d'indisponibilité persistante de la base, se replie silencieusement
 * sur les données statiques du portfolio.
 * (Les nouvelles tentatives réseau sont gérées couche par couche dans db.ts.)
 */
export const getPublicData = cache(async (): Promise<PublicData> => {
  try {
    const [profile, socials, skills, stats, experiences, projects, settings, photo, cv] =
      await Promise.all([
        getProfile(),
        getSocialLinks(),
        getSkills(),
        getStats(),
        getExperiences(),
        getProjects(),
        getSettings(),
        getMedia("photo"),
        getMedia("cv"),
      ]);

    return {
      profile: profile ?? fallbackProfile,
      socials: socials.length ? socials : fallbackSocials,
      skills: skills.length ? skills : fallbackSkills,
      stats: stats.length ? stats : fallbackStats,
      experiences: experiences.length ? experiences : fallbackExperiences,
      projects: projects.length ? projects : normalizeFallbackProjects(),
      settings: { ...fallbackSettings, ...settings },
      photo,
      cv,
      fromDatabase: true,
    };
  } catch (error) {
    // console.warn (et non error) : cas géré, pas besoin de déclencher
    // l'overlay d'erreur de Next.js en dev. On loggue le détail côté serveur.
    console.warn(
      `[portfolio] Base indisponible, repli sur les données statiques. Cause: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return {
      profile: fallbackProfile,
      socials: fallbackSocials,
      skills: fallbackSkills,
      stats: fallbackStats,
      experiences: fallbackExperiences,
      projects: normalizeFallbackProjects(),
      settings: fallbackSettings,
      photo: null,
      cv: null,
      fromDatabase: false,
    };
  }
});


