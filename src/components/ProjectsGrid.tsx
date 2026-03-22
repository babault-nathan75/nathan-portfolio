'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/lib/data';

export default function ProjectsGrid() {
  return (
    <section id="projets" className="py-24 bg-gray-950 text-white px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Mes Projets Réalisés</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Découvrez une sélection de mes applications web et mobiles, allant de la digitalisation de commerces locaux aux outils de gestion internes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group"
            >
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800">
                <Link href={project.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm ml-auto">
                  Live <ExternalLink size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}