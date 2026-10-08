import { getProjects } from "@/lib/db";
import { addProject, removeProject } from "@/lib/actions";
import { btnPrimary, card, input, label, sectionTitle } from "@/lib/ui";
import EditProjectRow from "@/components/admin/EditProjectRow";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projets</h1>
        <p className="text-sm text-gray-500 mt-1">
          {projects.length} projet{projects.length > 1 ? "s" : ""} en base.
        </p>
      </div>

      {saved && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          Modifications enregistrées.
        </p>
      )}

      <form action={addProject} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Ajouter un projet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-title" className={label}>Titre *</label>
            <input id="new-title" name="title" required className={input} placeholder="Mon projet" />
          </div>
          <div>
            <label htmlFor="new-link" className={label}>Lien (URL ou vide)</label>
            <input id="new-link" name="link" className={input} placeholder="https://…" />
          </div>
        </div>
        <div>
          <label htmlFor="new-description" className={label}>Description</label>
          <textarea id="new-description" name="description" rows={2} className={input} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-tags" className={label}>Tags (séparés par des virgules)</label>
            <input id="new-tags" name="tags" className={input} placeholder="Next.js, UI/UX" />
          </div>
          <div>
            <label htmlFor="new-status" className={label}>Statut</label>
            <select id="new-status" name="status" className={input} defaultValue="published">
              <option value="published">Publié</option>
              <option value="construction">En construction</option>
            </select>
          </div>
        </div>
        <button type="submit" className={btnPrimary}>Ajouter</button>
      </form>

      <div className="space-y-4">
        <h2 className={sectionTitle}>Existant</h2>
        {projects.map((project) => (
          <div key={project.id} className={card}>
            <EditProjectRow project={project} />
            <form action={removeProject} className="mt-4 pt-4 border-t border-gray-800">
              <input type="hidden" name="id" value={project.id} />
              <ConfirmDeleteButton confirmMessage={`Supprimer « ${project.title} » ?`}>
                Supprimer
              </ConfirmDeleteButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
