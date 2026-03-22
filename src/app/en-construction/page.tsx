'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function EnConstruction() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-6 text-center relative overflow-hidden">
      {/* Effet de fond subtil */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-900 p-6 rounded-full border border-gray-800 mb-8 shadow-lg shadow-blue-500/10">
          <Clock size={48} className="text-blue-500 animate-pulse" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Ce projet n&apos;est pas <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            encore en ligne
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
          Je travaille actuellement sur le développement de cette application, il s'agit d'un projet interne/privé. Vous en saurez plus très bientôt !
        </p>

        <Link 
          href="/" 
          className="flex items-center gap-2 bg-white text-gray-950 px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors shadow-lg"
        >
          <ArrowLeft size={18} /> 
          Retour au portfolio
        </Link>
      </motion.div>
    </main>
  );
}