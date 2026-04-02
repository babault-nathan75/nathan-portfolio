'use client';

import { motion } from 'framer-motion';

const skills = [
  { name: 'HTML', level: 88, color: 'from-blue-400 to-blue-600' },
  { name: 'CSS', level: 75, color: 'from-blue-400 to-blue-600' },
  { name: 'REACT', level: 78, color: 'from-blue-400 to-blue-600' },
  { name: 'NEXT.JS', level: 83, color: 'from-blue-400 to-blue-600' },
  { name: 'NODE.JS', level: 65, color: 'from-purple-400 to-blue-500' },
  { name: 'TAILWIND CSS', level: 80, color: 'from-purple-400 to-blue-500' },
  { name: 'FIGMA', level: 60, color: 'from-purple-400 to-blue-500' },
];

export default function SkillsSection() {
  return (
    <section className="py-24 bg-black text-white px-6 border-t border-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-purple-500 text-sm tracking-[0.2em] font-semibold mb-2 uppercase">
            Capacité Technique //
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-200">
            Stack de <span className="text-gray-500">Puissance</span>
          </h2>
        </motion.div>

        <div className="space-y-8 mb-20">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm tracking-widest text-gray-300 font-medium">{skill.name}</span>
                <span className="text-sm font-mono text-cyan-400">{skill.level}%</span>
              </div>
              <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${skill.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistiques circulaires */}
        <div className="flex justify-center gap-12 md:gap-24">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-32 h-32 rounded-full border border-gray-800 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin-slow"></div>
              <span className="text-3xl font-light">01</span>
            </div>
            <span className="text-xs tracking-widest text-gray-500 uppercase">Année</span>
            <span className="text-xs tracking-widest text-cyan-500 uppercase">Expérience</span>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-32 h-32 rounded-full border border-gray-800 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              <span className="text-2xl font-light italic">plusieurs</span>
            </div>
            <span className="text-xs tracking-widest text-gray-500 uppercase">Projets</span>
            <span className="text-xs tracking-widest text-cyan-500 uppercase">Réalisés</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}