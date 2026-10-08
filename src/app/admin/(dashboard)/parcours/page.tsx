import { getExperiences } from "@/lib/db";
import { addExperience, saveExperience, removeExperience } from "@/lib/actions";
import { btnPrimary, card, input, label, sectionTitle } from "@/lib/ui";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

function ExperienceFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${prefix}-type`} className={label}>Type</label>
          <select id={`${prefix}-type`} name="type" className={input} defaultValue="education">
            <option value="education">Formation</option>
            <option value="work">Expérience pro</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${prefix}-date`} className={label}>Date / période</label>
          <input id={`${prefix}-date`} name="date_label" className={input} placeholder="2023 - 2024" />
        </div>
      </div>
      <div>
        <label htmlFor={`${prefix}-title`} className={label}>Titre *</label>
        <input id={`${prefix}-title`} name="title" required className={input} />
      </div>
      <div>
        <label htmlFor={`${prefix}-org`} className={label}>Organisme</label>
        <input id={`${prefix}-org`} name="organization" className={input} />
      </div>
      <div>
        <label htmlFor={`${prefix}-desc`} className={label}>Description</label>
        <textarea id={`${prefix}-desc`} name="description" rows={2} className={input} />
      </div>
    </>
  );
}

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const experiences = await getExperiences();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Parcours</h1>
        <p className="text-sm text-gray-500 mt-1">Formations et expériences professionnelles.</p>
      </div>

      {saved && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          Modifications enregistrées.
        </p>
      )}

      <form action={addExperience} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Ajouter une entrée</h2>
        <ExperienceFields prefix="new" />
        <button type="submit" className={btnPrimary}>Ajouter</button>
      </form>

      <div className="space-y-4">
        <h2 className={sectionTitle}>Existant ({experiences.length})</h2>
        {experiences.map((exp) => (
          <div key={exp.id} className={card}>
            <form action={saveExperience} className="space-y-4">
              <input type="hidden" name="id" value={exp.id} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`exp-type-${exp.id}`} className={label}>Type</label>
                  <select id={`exp-type-${exp.id}`} name="type" className={input} defaultValue={exp.type}>
                    <option value="education">Formation</option>
                    <option value="work">Expérience pro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`exp-date-${exp.id}`} className={label}>Date / période</label>
                  <input
                    id={`exp-date-${exp.id}`}
                    name="date_label"
                    defaultValue={exp.date_label}
                    className={input}
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`exp-title-${exp.id}`} className={label}>Titre</label>
                <input id={`exp-title-${exp.id}`} name="title" required defaultValue={exp.title} className={input} />
              </div>
              <div>
                <label htmlFor={`exp-org-${exp.id}`} className={label}>Organisme</label>
                <input
                  id={`exp-org-${exp.id}`}
                  name="organization"
                  defaultValue={exp.organization}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor={`exp-desc-${exp.id}`} className={label}>Description</label>
                <textarea
                  id={`exp-desc-${exp.id}`}
                  name="description"
                  rows={2}
                  defaultValue={exp.description}
                  className={input}
                />
              </div>
              <button type="submit" className={btnPrimary}>Enregistrer</button>
            </form>
            <form action={removeExperience} className="mt-4 pt-4 border-t border-gray-800">
              <input type="hidden" name="id" value={exp.id} />
              <ConfirmDeleteButton confirmMessage={`Supprimer « ${exp.title} » ?`}>Supprimer</ConfirmDeleteButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
