import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion | Admin" };

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Espace administrateur</h1>
          <p className="text-sm text-gray-500">Portfolio Nathan Babault</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
