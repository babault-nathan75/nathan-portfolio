import { getProfile, getSocialLinks, getMedia } from "@/lib/db";
import { saveProfile, saveContact, addSocialLink, saveSocialLink, removeSocialLink, removeMedia } from "@/lib/actions";
import { btnPrimary, btnSecondary, card, input, label, sectionTitle } from "@/lib/ui";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import UploadForm from "@/components/admin/UploadForm";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [profile, socials, photo, cv] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getMedia("photo"),
    getMedia("cv"),
  ]);

  if (!profile) {
    return <p className="text-red-400">Profil introuvable — relance npm run db:setup.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profil & Hero</h1>
        <p className="text-sm text-gray-500 mt-1">Section d&apos;accueil, contact et liens sociaux.</p>
      </div>

      {saved && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          Modifications enregistrées.
        </p>
      )}

      <form action={saveProfile} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Hero</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className={label}>Nom affiché</label>
            <input id="first_name" name="first_name" defaultValue={profile.first_name} className={input} />
          </div>
          <div>
            <label htmlFor="location" className={label}>Localisation</label>
            <input id="location" name="location" defaultValue={profile.location} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="tagline" className={label}>Accroche (avant la liste d&apos;expertise)</label>
          <textarea id="tagline" name="tagline" rows={2} defaultValue={profile.tagline} className={input} />
        </div>
        <div>
          <label htmlFor="expertise" className={label}>Liste d&apos;expertise (en gras)</label>
          <input id="expertise" name="expertise" defaultValue={profile.expertise} className={input} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-end gap-3 pb-1">
            <input
              type="checkbox"
              id="available"
              name="available"
              defaultChecked={profile.available}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900"
            />
            <label htmlFor="available" className="text-sm text-gray-300">Badge « disponible » visible</label>
          </div>
          <div>
            <label htmlFor="available_text" className={label}>Texte du badge</label>
            <input
              id="available_text"
              name="available_text"
              defaultValue={profile.available_text}
              className={input}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cta_projects_label" className={label}>Bouton projets</label>
            <input
              id="cta_projects_label"
              name="cta_projects_label"
              defaultValue={profile.cta_projects_label}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="cta_cv_label" className={label}>Bouton CV</label>
            <input id="cta_cv_label" name="cta_cv_label" defaultValue={profile.cta_cv_label} className={input} />
          </div>
        </div>
        <button type="submit" className={btnPrimary}>Enregistrer le hero</button>
      </form>

      <form action={saveContact} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Contact (section Contact)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_location" className={label}>Localisation</label>
            <input
              id="contact_location"
              name="contact_location"
              defaultValue={profile.contact_location}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="contact_availability" className={label}>Disponibilité</label>
            <input
              id="contact_availability"
              name="contact_availability"
              defaultValue={profile.contact_availability}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="contact_email" className={label}>Email</label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={profile.contact_email}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="contact_phone" className={label}>Téléphone</label>
            <input
              id="contact_phone"
              name="contact_phone"
              defaultValue={profile.contact_phone}
              className={input}
            />
          </div>
        </div>
        <button type="submit" className={btnPrimary}>Enregistrer le contact</button>
      </form>

      <div className={card}>
        <h2 className={sectionTitle}>Fichiers (photo & CV)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <UploadForm kind="photo" label="Photo de profil (PNG/JPG/WebP)" current={photo?.filename} />
            {photo && (
              <form action={removeMedia}>
                <input type="hidden" name="kind" value="photo" />
                <ConfirmDeleteButton confirmMessage="Supprimer la photo uploadée ?">
                  Supprimer la photo
                </ConfirmDeleteButton>
              </form>
            )}
          </div>
          <div className="space-y-3">
            <UploadForm kind="cv" label="CV (PDF)" current={cv?.filename} />
            {cv && (
              <form action={removeMedia}>
                <input type="hidden" name="kind" value="cv" />
                <ConfirmDeleteButton confirmMessage="Supprimer le CV uploadé ?">
                  Supprimer le CV
                </ConfirmDeleteButton>
              </form>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4">
          Sans upload, le site utilise <code>/nathan.png</code> et <code>/cv-nathan-babault.pdf</code>.
        </p>
      </div>

      <div className={card}>
        <h2 className={sectionTitle}>Liens sociaux</h2>
        <div className="space-y-4">
          {socials.map((social) => (
            <div key={social.id} className="border border-gray-800 rounded-xl p-4">
              <form action={saveSocialLink} className="space-y-3">
                <input type="hidden" name="id" value={social.id} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor={`soc-label-${social.id}`} className={label}>Libellé</label>
                    <input
                      id={`soc-label-${social.id}`}
                      name="label"
                      defaultValue={social.label}
                      className={input}
                    />
                  </div>
                  <div>
                    <label htmlFor={`soc-url-${social.id}`} className={label}>URL</label>
                    <input id={`soc-url-${social.id}`} name="url" defaultValue={social.url} className={input} />
                  </div>
                  <div>
                    <label htmlFor={`soc-icon-${social.id}`} className={label}>Icône</label>
                    <select
                      id={`soc-icon-${social.id}`}
                      name="icon"
                      defaultValue={social.icon}
                      className={input}
                    >
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="mail">Email</option>
                      <option value="globe">Globe</option>
                      <option value="twitter">Twitter / X</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className={btnPrimary}>Enregistrer</button>
                </div>
              </form>
              <form action={removeSocialLink} className="mt-3 pt-3 border-t border-gray-800">
                <input type="hidden" name="id" value={social.id} />
                <ConfirmDeleteButton confirmMessage={`Supprimer le lien « ${social.label} » ?`}>
                  Supprimer
                </ConfirmDeleteButton>
              </form>
            </div>
          ))}
        </div>

        <form action={addSocialLink} className="mt-6 pt-6 border-t border-gray-800 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Ajouter un lien</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="soc-new-label" className={label}>Libellé</label>
              <input id="soc-new-label" name="label" required className={input} placeholder="Twitter" />
            </div>
            <div>
              <label htmlFor="soc-new-url" className={label}>URL</label>
              <input id="soc-new-url" name="url" required className={input} placeholder="https://…" />
            </div>
            <div>
              <label htmlFor="soc-new-icon" className={label}>Icône</label>
              <select id="soc-new-icon" name="icon" className={input} defaultValue="globe">
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="mail">Email</option>
                <option value="globe">Globe</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>
          </div>
          <button type="submit" className={btnSecondary}>Ajouter le lien</button>
        </form>
      </div>
    </div>
  );
}


