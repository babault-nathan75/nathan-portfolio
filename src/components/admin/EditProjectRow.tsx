"use client";

import { saveProject } from "@/lib/actions";
import type { Project } from "@/lib/db";
import { btnPrimary, input, label } from "@/lib/ui";

/** Formulaire d'édition d'un projet existant (un par carte). */
export default function EditProjectRow({ project }: { project: Project }) {
  return (
    <form action={saveProject} className="space-y-4">
      <input type="hidden" name="id" value={project.id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`title-${project.id}`} className={label}>Titre</label>
          <input
            id={`title-${project.id}`}
            name="title"
            required
            defaultValue={project.title}
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`link-${project.id}`} className={label}>Lien</label>
          <input id={`link-${project.id}`} name="link" defaultValue={project.link} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor={`description-${project.id}`} className={label}>Description</label>
        <textarea
          id={`description-${project.id}`}
          name="description"
          rows={2}
          defaultValue={project.description}
          className={input}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`tags-${project.id}`} className={label}>Tags (virgules)</label>
          <input id={`tags-${project.id}`} name="tags" defaultValue={project.tags} className={input} />
        </div>
        <div>
          <label htmlFor={`status-${project.id}`} className={label}>Statut</label>
          <select
            id={`status-${project.id}`}
            name="status"
            defaultValue={project.status}
            className={input}
          >
            <option value="published">Publié</option>
            <option value="construction">En construction</option>
          </select>
        </div>
      </div>
      <button type="submit" className={btnPrimary}>Enregistrer</button>
    </form>
  );
}
