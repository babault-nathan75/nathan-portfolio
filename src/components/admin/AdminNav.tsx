"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderKanban,
  Gauge,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { logout } from "@/lib/actions";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: Gauge, exact: true },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/competences", label: "Compétences", icon: Sparkles },
  { href: "/admin/parcours", label: "Parcours", icon: Briefcase },
  { href: "/admin/profil", label: "Profil & Hero", icon: User },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 bg-gray-900/50 min-h-screen p-4 flex flex-col">
      <Link href="/" className="block px-3 py-2 mb-4 text-sm text-gray-500 hover:text-white transition-colors">
        ← Retour au site
      </Link>

      <nav className="space-y-1 flex-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent"
              }`}
            >
              <Icon size={16} />
              {label}
              {href === "/admin/messages" && unreadCount > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </form>
    </aside>
  );
}
