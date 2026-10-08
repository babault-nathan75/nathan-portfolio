import Link from "next/link";
import { FolderKanban, Mail, Sparkles, Briefcase } from "lucide-react";
import { getMessages, getProjects, getSkills, getExperiences, countUnreadMessages } from "@/lib/db";
import { card, sectionTitle } from "@/lib/ui";

export default async function AdminDashboard() {
  const [projects, skills, experiences, unread, messages] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperiences(),
    countUnreadMessages(),
    getMessages(),
  ]);

  const stats = [
    { label: "Projets", value: projects.length, href: "/admin/projets", icon: FolderKanban },
    { label: "Compétences", value: skills.length, href: "/admin/competences", icon: Sparkles },
    { label: "Parcours", value: experiences.length, href: "/admin/parcours", icon: Briefcase },
    { label: "Messages non lus", value: unread, href: "/admin/messages", icon: Mail },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble du portfolio.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className={`${card} hover:border-blue-500/50 transition-colors`}>
            <Icon size={18} className="text-blue-400 mb-3" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className={sectionTitle}>Derniers messages</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun message pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m.id} className={card}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="font-medium text-sm">
                    {m.name}{" "}
                    {!m.is_read && <span className="text-blue-400 text-xs">• non lu</span>}
                  </p>
                  <span className="text-xs text-gray-600">
                    {new Date(m.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{m.email}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{m.message}</p>
              </div>
            ))}
            {messages.length > 5 && (
              <Link href="/admin/messages" className="text-sm text-blue-400 hover:underline">
                Voir tous les messages →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
