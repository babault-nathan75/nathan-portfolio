import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactSection from "@/components/ContactSection";
import { getPublicData } from "@/lib/public-data";

export default async function Home() {
  const data = await getPublicData();

  // Mode maintenance : masque le site public (l'admin reste accessible via /admin)
  if (data.settings.maintenance === "true") {
    return (
      <main className="bg-gray-950 min-h-screen flex items-center justify-center text-white px-6">
        <div className="text-center max-w-md">
          <p className="text-blue-400 text-sm tracking-[0.2em] font-semibold mb-4 uppercase">
            Maintenance
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Le site est en maintenance</h1>
          <p className="text-gray-400">
            Je suis en train de mettre à jour mon portfolio. Revenez très vite !
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-950 min-h-screen">
      <HeroSection
        profile={data.profile}
        socials={data.socials}
        photoUrl={data.photo ? "/api/media/photo" : "/nathan.png"}
        cvUrl={data.cv ? "/api/media/cv" : "/cv-nathan-babault.pdf"}
      />

      <SkillsSection skills={data.skills} stats={data.stats} />
      <ExperienceSection experiences={data.experiences} />

      <ProjectsGrid projects={data.projects} />
      <ContactSection profile={data.profile} />

      <footer className="bg-gray-950 py-8 text-center text-gray-500 border-t border-gray-900 text-sm">
        <p>© {new Date().getFullYear()} <a href="/admin" className="hover:text-white">Nathan Babault.</a> Tous droits réservés.</p>
        <p className="mt-1">{data.settings.footer_text}</p>
      </footer>
    </main>
  );
}