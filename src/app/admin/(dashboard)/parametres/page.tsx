import { getSettings } from "@/lib/db";
import { saveSettings } from "@/lib/actions";
import { btnPrimary, card, input, label, sectionTitle } from "@/lib/ui";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">SEO, pied de page, maintenance et sécurité.</p>
      </div>

      {saved && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          Modifications enregistrées.
        </p>
      )}

      <form action={saveSettings} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Site</h2>
        <div>
          <label htmlFor="site_title" className={label}>Titre du site (SEO)</label>
          <input
            id="site_title"
            name="site_title"
            defaultValue={settings.site_title ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="site_description" className={label}>Description (SEO)</label>
          <textarea
            id="site_description"
            name="site_description"
            rows={2}
            defaultValue={settings.site_description ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="footer_text" className={label}>Texte du pied de page</label>
          <input
            id="footer_text"
            name="footer_text"
            defaultValue={settings.footer_text ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="formspree_url" className={label}>URL Formspree (notifications email)</label>
          <input
            id="formspree_url"
            name="formspree_url"
            defaultValue={settings.formspree_url ?? ""}
            className={input}
            placeholder="https://formspree.io/f/…"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="maintenance"
            name="maintenance"
            defaultChecked={settings.maintenance === "true"}
            className="h-4 w-4 rounded border-gray-700 bg-gray-900"
          />
          <label htmlFor="maintenance" className="text-sm text-gray-300">
            Mode maintenance (masque le site public)
          </label>
        </div>
        <button type="submit" className={btnPrimary}>Enregistrer</button>
      </form>

      <ChangePasswordForm />
    </div>
  );
}
