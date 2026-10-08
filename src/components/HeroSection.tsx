'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Globe, Linkedin, Mail, MapPin, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Profile = {
  first_name: string;
  tagline: string;
  expertise: string;
  location: string;
  available: boolean;
  available_text: string;
  cta_projects_label: string;
  cta_cv_label: string;
};

type SocialLink = { id: number; label: string; url: string; icon: string };

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  globe: Globe,
  twitter: Twitter,
};

export default function HeroSection({
  profile,
  socials,
  photoUrl,
  cvUrl,
}: {
  profile: Profile;
  socials: SocialLink[];
  photoUrl: string;
  cvUrl: string;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-950 text-white px-6 py-20 overflow-hidden">
      {/* Effet de fond subtil */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opaque-10" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLONNE GAUCHE : Texte et boutons */}
          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
            {profile.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {profile.available_text}
              </span>
            </motion.div>
            )}

            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Salut, je suis <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {profile.first_name}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-400 mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile.tagline} <span className="text-white font-semibold">{profile.expertise}</span>
            </motion.p>
            
            <motion.div
              className="flex items-center gap-2 text-gray-500 mb-10 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
                <MapPin size={18} className="text-gray-600"/>
                <span>{profile.location}</span>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                href="#projets" 
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-lg shadow-blue-500/20"
              >
                {profile.cta_projects_label} <ArrowRight size={18} />
              </Link>
              
              <Link 
                href={cvUrl} 
                target="_blank"
                className="flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors border border-gray-700 w-full sm:w-auto justify-center"
              >
                {profile.cta_cv_label} <Download size={18} />
              </Link>
            </motion.div>

            {/* Liens sociaux */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-6 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon] ?? Globe;
                return (
                  <Link
                    key={social.id}
                    href={social.url}
                    target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                    className="hover:text-white hover:scale-110 transition-all"
                  >
                    <Icon size={24} />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          </div>

          {/* COLONNE DROITE : La Photo (Rectangle Vertical) */}
          <motion.div 
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2 mb-12 lg:mb-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative group">
              {/* Effet de halo lumineux derrière la photo (adapté au rectangle) */}
              <div className="absolute -inset-2 bg-gradient-to-b from-blue-600 to-purple-700 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Conteneur de l'image : Rectangle Vertical (aspect-[2/3]) */}
              <div className="relative aspect-[2/3] w-64 md:w-72 border-4 border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 bg-gray-900 group-hover:border-blue-500/50 transition-colors duration-300 z-10">
                <Image 
                  src={photoUrl}
                  alt={`${profile.first_name} - Développeur Full-Stack`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 256px, 288px"
                />
                
                {/* Overlay dégradé subtil au bas de l'image pour le style */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-20"></div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}