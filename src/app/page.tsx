import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-gray-950 min-h-screen">
      <HeroSection />
      
      {/* Les deux nouvelles sections ajoutées ! */}
      <SkillsSection />
      <ExperienceSection />
      
      <ProjectsGrid />
      <ContactSection />
      
      {/* Footer simple */}
      <footer className="bg-gray-950 py-8 text-center text-gray-500 border-t border-gray-900 text-sm">
        <p>© {new Date().getFullYear()} Nathan Babault. Tous droits réservés.</p>
        <p className="mt-1">Fait avec Next.js & Tailwind CSS.</p>
      </footer>
    </main>
  );
}