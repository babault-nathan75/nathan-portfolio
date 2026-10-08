'use client';

import { motion } from 'framer-motion';

type Skill = {
  id: number;
  name: string;
  level: number;
  color: 'blue' | 'purple';
};

type Stat = {
  id: number;
  value: string;
  label_top: string;
  label_bottom: string;
};

const GRADIENTS = {
  blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-blue-500',
} as const;

export default function SkillsSection({ skills, stats }: { skills: Skill[]; stats: Stat[] }) {
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
            Stack de <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Puissance</span>
          </h2>
        </motion.div>

        <div className="space-y-8 mb-20">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.id}
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
                  className={`h-full bg-gradient-to-r ${GRADIENTS[skill.color]}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistiques circulaires */}
        <div className="flex justify-center gap-12 md:gap-24">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="w-32 h-32 rounded-full border border-gray-800 flex items-center justify-center relative mb-4">
                <div
                  className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin-slow"
                  style={index % 2 === 1 ? { animationDirection: 'reverse' } : undefined}
                ></div>
                <span className={stat.value.length > 3 ? "text-2xl font-light italic" : "text-3xl font-light"}>
                  {stat.value}
                </span>
              </div>
              <span className="text-xs tracking-widest text-gray-500 uppercase">{stat.label_top}</span>
              <span className="text-xs tracking-widest text-cyan-500 uppercase">{stat.label_bottom}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}