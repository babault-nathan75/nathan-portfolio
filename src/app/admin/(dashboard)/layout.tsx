import { requireAdmin } from "@/lib/auth";
import { countUnreadMessages } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unreadCount = await countUnreadMessages();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <AdminNav unreadCount={unreadCount} />
      <main className="flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
