'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gray-900 text-white px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Travaillons Ensemble</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Que ce soit pour une opportunité en CDI ou pour digitaliser votre entreprise en freelance, je suis à votre écoute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-blue-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Localisation</h3>
                <p className="text-gray-400">Yopougon, Abidjan<br />Disponible en présentiel et télétravail</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <a href="mailto:nathan.babault@epitech.eu" className="text-gray-400 hover:text-white transition-colors">
                  nathan.babault@epitech.eu
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-blue-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                <a href="tel:+2250103573023" className="text-gray-400 hover:text-white transition-colors">
                  +225 01 03 57 30 23
                </a>
              </div>
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-950 p-8 rounded-2xl border border-gray-800 space-y-6"
            action="https://formspree.io/f/xbdzvlwr" // On en parle juste en bas !
            method="POST"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-400">Nom complet</label>
                <input type="text" id="name" name="name" required className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-400">Adresse email</label>
                <input type="email" id="email" name="email" required className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
              <textarea id="message" name="message" required rows={5} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" placeholder="Parlez-moi de votre projet..."></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              Envoyer le message <Send size={18} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}