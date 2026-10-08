import { getSkills, getStats } from "@/lib/db";
import { addSkill, saveSkill, removeSkill, addStat, saveStat, removeStat } from "@/lib/actions";
import { btnPrimary, card, input, label, sectionTitle } from "@/lib/ui";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [skills, stats] = await Promise.all([getSkills(), getStats()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Compétences</h1>
        <p className="text-sm text-gray-500 mt-1">Barres de progression et statistiques circulaires.</p>
      </div>

      {saved && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
          Modifications enregistrées.
        </p>
      )}

      <form action={addSkill} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Ajouter une compétence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="skill-name" className={label}>Nom *</label>
            <input id="skill-name" name="name" required className={input} placeholder="React" />
          </div>
          <div>
            <label htmlFor="skill-level" className={label}>Niveau (0-100)</label>
            <input id="skill-level" name="level" type="number" min={0} max={100} defaultValue={70} className={input} />
          </div>
          <div>
            <label htmlFor="skill-color" className={label}>Couleur</label>
            <select id="skill-color" name="color" className={input} defaultValue="blue">
              <option value="blue">Bleu</option>
              <option value="purple">Violet</option>
            </select>
          </div>
        </div>
        <button type="submit" className={btnPrimary}>Ajouter</button>
      </form>

      <div className="space-y-4">
        <h2 className={sectionTitle}>Barres ({skills.length})</h2>
        {skills.map((skill) => (
          <div key={skill.id} className={card}>
            <form action={saveSkill} className="space-y-4">
              <input type="hidden" name="id" value={skill.id} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`skill-name-${skill.id}`} className={label}>Nom</label>
                  <input
                    id={`skill-name-${skill.id}`}
                    name="name"
                    required
                    defaultValue={skill.name}
                    className={input}
                  />
                </div>
                <div>
                  <label htmlFor={`skill-level-${skill.id}`} className={label}>Niveau</label>
                  <input
                    id={`skill-level-${skill.id}`}
                    name="level"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={skill.level}
                    className={input}
                  />
                </div>
                <div>
                  <label htmlFor={`skill-color-${skill.id}`} className={label}>Couleur</label>
                  <select
                    id={`skill-color-${skill.id}`}
                    name="color"
                    defaultValue={skill.color}
                    className={input}
                  >
                    <option value="blue">Bleu</option>
                    <option value="purple">Violet</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={btnPrimary}>Enregistrer</button>
            </form>
            <form action={removeSkill} className="mt-4 pt-4 border-t border-gray-800">
              <input type="hidden" name="id" value={skill.id} />
              <ConfirmDeleteButton confirmMessage={`Supprimer « ${skill.name} » ?`}>Supprimer</ConfirmDeleteButton>
            </form>
          </div>
        ))}
      </div>

      <form action={addStat} className={`${card} space-y-4`}>
        <h2 className={sectionTitle}>Ajouter une statistique circulaire</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="stat-value" className={label}>Valeur *</label>
            <input id="stat-value" name="value" required className={input} placeholder="02" />
          </div>
          <div>
            <label htmlFor="stat-top" className={label}>Label haut</label>
            <input id="stat-top" name="label_top" className={input} placeholder="Années" />
          </div>
          <div>
            <label htmlFor="stat-bottom" className={label}>Label bas</label>
            <input id="stat-bottom" name="label_bottom" className={input} placeholder="Expériences" />
          </div>
        </div>
        <button type="submit" className={btnPrimary}>Ajouter</button>
      </form>

      <div className="space-y-4">
        <h2 className={sectionTitle}>Statistiques ({stats.length})</h2>
        {stats.map((stat) => (
          <div key={stat.id} className={card}>
            <form action={saveStat} className="space-y-4">
              <input type="hidden" name="id" value={stat.id} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`stat-value-${stat.id}`} className={label}>Valeur</label>
                  <input id={`stat-value-${stat.id}`} name="value" defaultValue={stat.value} className={input} />
                </div>
                <div>
                  <label htmlFor={`stat-top-${stat.id}`} className={label}>Label haut</label>
                  <input id={`stat-top-${stat.id}`} name="label_top" defaultValue={stat.label_top} className={input} />
                </div>
                <div>
                  <label htmlFor={`stat-bottom-${stat.id}`} className={label}>Label bas</label>
                  <input id={`stat-bottom-${stat.id}`} name="label_bottom" defaultValue={stat.label_bottom} className={input} />
                </div>
              </div>
              <button type="submit" className={btnPrimary}>Enregistrer</button>
            </form>
            <form action={removeStat} className="mt-4 pt-4 border-t border-gray-800">
              <input type="hidden" name="id" value={stat.id} />
              <ConfirmDeleteButton confirmMessage={`Supprimer la statistique « ${stat.value} » ?`}>Supprimer</ConfirmDeleteButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
