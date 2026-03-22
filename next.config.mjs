/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dit à Next.js de générer un site statique
  output: 'export',
  
  // Désactive l'optimisation d'image serveur (obligatoire pour GitHub Pages)
  images: {
    unoptimized: true,
  },

  // IMPORTANT : Si ton dépôt GitHub s'appelle "portfolio" 
  // (pour avoir babault-nathan75.github.io/portfolio), décommente la ligne ci-dessous :
  // basePath: '/portfolio',
};

export default nextConfig;