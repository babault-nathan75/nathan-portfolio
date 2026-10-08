import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compilation React Compiler (hérité de l'ancienne config)
  reactCompiler: true,

  // Désactive l'optimisation d'image serveur (hérité de l'ancienne config)
  images: {
    unoptimized: true,
  },

  // Les uploads (photo, CV) passent par des Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
