import HeroSection from "@/components/HeroSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-gray-950 min-h-screen">
      <HeroSection />
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