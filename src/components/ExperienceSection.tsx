'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';

type Experience = {
  id: number;
  type: 'work' | 'education';
  title: string;
  organization: string;
  date_label: string;
  description: string;
};

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="parcours" className="py-24 bg-gray-950 text-white px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Mon <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Parcours</span></h2>
          <p className="text-gray-400 text-lg">Cursus académique et expériences professionnelles.</p>
        </motion.div>

        <div className="relative border-l border-gray-800 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Icône sur la ligne du temps */}
              <div className="absolute -left-5 md:-left-6 top-1 bg-gray-900 border border-gray-700 p-2 rounded-full">
                {exp.type === 'work' ? (
                  <Briefcase size={20} className="text-blue-400" />
                ) : (
                  <GraduationCap size={20} className="text-purple-400" />
                )}
              </div>
              
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
                <span className="text-sm font-medium text-blue-500 mb-2 block">{exp.date_label}</span>
                <h3 className="text-xl font-bold text-gray-100 mb-1">{exp.title}</h3>
                <h4 className="text-md text-gray-400 mb-4">{exp.organization}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}