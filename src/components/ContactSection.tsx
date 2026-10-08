'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { submitContact, type ContactState } from '@/lib/actions';

type ContactProfile = {
  contact_location: string;
  contact_availability: string;
  contact_email: string;
  contact_phone: string;
};

const initial: ContactState = {};

export default function ContactSection({ profile }: { profile: ContactProfile }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, initial);

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
                <p className="text-gray-400">{profile.contact_location}<br />{profile.contact_availability}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <a href={`mailto:${profile.contact_email}`} className="text-gray-400 hover:text-white transition-colors">
                  {profile.contact_email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-lg text-blue-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                <a href={`tel:${profile.contact_phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-white transition-colors">
                  {profile.contact_phone}
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
            action={formAction}
          >
            {/* Honeypot anti-spam (invisible pour les humains) */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

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

            {state.error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}
            {state.ok && (
              <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                Merci ! Votre message a bien été envoyé, je vous réponds au plus vite.
              </p>
            )}

            <button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {pending ? 'Envoi…' : 'Envoyer le message'} <Send size={18} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}