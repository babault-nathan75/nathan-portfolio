// Données statiques de repli : utilisées si la base Neon est injoignable.
// Source historique du portfolio (avant migration vers la BDD).

export const fallbackProjects = [
  {
    id: 1,
    title: "Hebron-ivoire Shops",
    description: "Plateforme e-commerce multiservices intégrant une boutique générale, une librairie chrétienne (avec gestion de TVA complexe) et un service de réservation/commande de repas.",
    tags: ["Next.js", "E-commerce", "UI/UX", "MongoDB"],
    link: "https://hebronivoireshops.com",
  },
  {
    id: 2,
    title: "Esther Bella Fashion",
    description: "Création d'une boutique en ligne pour une marque de mode basée à Abidjan. Focus particulier sur l'optimisation SEO, la génération de sitemap et l'expérience utilisateur.",
    tags: ["React", "SEO", "E-commerce", "MongoDB"],
    link: "https://esther-bella-shop.vercel.app/",
  },
  {
    id: 3,
    title: "Bio Medical",
    description: "Site web permettant d'accéder à des médicaments de Yupi global. Développement complet de l'interface et intégration du backend.",
    tags: ["Next.js", "Mobile/desktop", "UI/UX", "MongoDB"],
    link: "https://bio-medical-babaults-projects.vercel.app/",
  },
  {
    id: 4,
    title: "Rotten Tomatoes",
    description: "Site web permettant d'accéder au notes des films. Développement complet de l'interface et intégration du backend.",
    tags: ["Next.js", "Mobile/desktop", "UI/UX", "MongoDB"],
    link: "https://movies-tomatoe.vercel.app/",
  },
  {
    id: 5,
    title: "T-KAI Shop",
    description: "Site web permettant d'acheter des tee-shirts personnalisés mangas. Développement complet de l'interface et intégration du backend.",
    tags: ["Next.js", "Mobile/desktop", "UI/UX", "postgreSQL"],
    link: "https://tkai-shop.vercel.app/",
  },
  {
    id: 6,
    title: "Secrétariat Pro",
    description: "Site web de mise en relation entre professionnels du secrétariat et clients/entreprises. Développement complet de l'interface et intégration du backend.",
    tags: ["Next.js", "Mobile/desktop", "UI/UX", "Supabase"],
    link: "https://secretariatpro-drab.vercel.app/",
  },
  {
    id: 7,
    title: "Formation Word Excel",
    description: "Plateforme de formation en ligne pour les logiciels Word et Excel. Développement complet de l'interface et intégration du backend.",
    tags: ["Next.js", "Mobile/desktop", "UI/UX", "Supabase"],
    link: "https://formation-word-excel.vercel.app/",
  },
  {
    id: 8,
    title: "YOWL",
    description: "Plateforme de publication de contenu libre. Développement de bout en bout (Front-end et Back-end) du système de publications et de gestion des liens.",
    tags: ["Laravel", "PHP", "Full-Stack"],
    link: "/en-construction",
  },
  {
    id: 9,
    title: "EPICTURE",
    description: "Clone mobile de l'application Trello. Développement complet des workspaces, gestion d'état et synchronisation avec le backend.",
    tags: ["React Native", "Mobile", "API"],
    link: "/en-construction",
  },{
    id: 10,
    title: "EBIZ",
    description: "ERP de gestion d'entreprise. Développement complet des workspaces, gestion d'état et synchronisation avec le backend.",
    tags: ["Next.js", "Python", "Mobile/Desktop", "UI/UX", "API", "PostgreSQL"],
    link: "/en-construction",
  },
];

export const fallbackProfile = {
  first_name: "BABAULT Nathan Charles",
  tagline:
    "Développeur Full-Stack basé à Abidjan. Je conçois des applications web et mobiles robustes avec une expertise sur",
  expertise: "Laravel, SQL, MongoDB, TailwindCSS, PHP, React, Next.js, Supabase et Python",
  location: "Yopougon, Abidjan",
  available: true,
  available_text: "Disponible pour CDI & Freelance",
  cta_projects_label: "Voir mes projets",
  cta_cv_label: "Télécharger mon CV",
  contact_location: "Yopougon, Abidjan",
  contact_availability: "Disponible en présentiel et télétravail",
  contact_email: "nathan.babault@epitech.eu",
  contact_phone: "+225 01 03 57 30 23",
};

export const fallbackSocials = [
  { id: 1, label: "GitHub", url: "https://github.com/babault-nathan75", icon: "github", sort_order: 0 },
  {
    id: 2,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/nathan-babault-a57207372/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: "linkedin",
    sort_order: 1,
  },
  { id: 3, label: "Email", url: "mailto:nathan.babault@epitech.eu", icon: "mail", sort_order: 2 },
];

export const fallbackSkills = [
  { id: 1, name: "HTML", level: 88, color: "blue" as const, sort_order: 0 },
  { id: 2, name: "CSS", level: 75, color: "blue" as const, sort_order: 1 },
  { id: 3, name: "Laravel", level: 65, color: "blue" as const, sort_order: 2 },
  { id: 4, name: "PHP", level: 70, color: "blue" as const, sort_order: 3 },
  { id: 5, name: "JavaScript", level: 80, color: "blue" as const, sort_order: 4 },
  { id: 6, name: "REACT", level: 87, color: "blue" as const, sort_order: 5 },
  { id: 7, name: "NEXT.JS", level: 91, color: "blue" as const, sort_order: 6 },
  { id: 8, name: "NODE.JS", level: 74, color: "purple" as const, sort_order: 7 },
  { id: 9, name: "PYTHON", level: 70, color: "purple" as const, sort_order: 8 },
  { id: 10, name: "GitHub", level: 88, color: "purple" as const, sort_order: 9 },
  { id: 11, name: "SUPABASE", level: 75, color: "purple" as const, sort_order: 10 },
  { id: 12, name: "MONGODB", level: 80, color: "purple" as const, sort_order: 11 },
  { id: 13, name: "TAILWIND CSS", level: 86, color: "purple" as const, sort_order: 12 },
  { id: 14, name: "SQL", level: 90, color: "purple" as const, sort_order: 13 },
  { id: 15, name: "FIGMA", level: 73, color: "purple" as const, sort_order: 14 },
];

export const fallbackStats = [
  { id: 1, value: "02", label_top: "Années", label_bottom: "Expériences", sort_order: 0 },
  { id: 2, value: "plusieurs", label_top: "Projets", label_bottom: "Réalisés", sort_order: 1 },
];

export const fallbackExperiences = [
  {
    id: 1,
    type: "education" as const,
    title: "Attestation de formation en développement FULL-STACK",
    organization: "WECODE, GIZ, FORPRODE, EPITECH",
    date_label: "2026",
    description: "Spécialisation dans le développement web moderne (Front-end et Back-end).",
    sort_order: 0,
  },
  {
    id: 2,
    type: "work" as const,
    title: "Stage en informatique (06 Mois)",
    organization: "Centre National de Transfusion Sanguine de Côte d’Ivoire",
    date_label: "2025",
    description: "Conception d'application web local, Assistance Technique et Collection de données.",
    sort_order: 1,
  },
  {
    id: 3,
    type: "education" as const,
    title: "BTS Informatique Développeur d'Application",
    organization: "Institut de Formation Sainte Marie, Abidjan",
    date_label: "2023 - 2024",
    description: "Formation technique approfondie en développement d'applications.",
    sort_order: 2,
  },
  {
    id: 4,
    type: "education" as const,
    title: "Baccalauréat D",
    organization: "Groupe Scolaire Israël, Bonoua",
    date_label: "2021 - 2022",
    description: "Série scientifique.",
    sort_order: 3,
  },
];

export const fallbackSettings: Record<string, string> = {
  site_title: "BABAULT Nathan | Développeur Full-Stack",
  site_description:
    "Portfolio de Nathan BABAULT, Développeur Full-Stack spécialisé en solutions web et mobiles.",
  footer_text: "Fait avec Next.js & Tailwind CSS.",
  maintenance: "false",
  formspree_url: "https://formspree.io/f/xbdzvlwr",
};
