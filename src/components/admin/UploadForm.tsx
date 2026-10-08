"use client";

import { useActionState } from "react";
import { uploadPhoto, uploadCv, type LoginState } from "@/lib/actions";
import { btnPrimary, label } from "@/lib/ui";

/**
 * Formulaire d'upload photo ou CV (Server Action avec état).
 * `current` = nom du fichier déjà stocké en base, le cas échéant.
 */
export default function UploadForm({
  kind,
  label: fieldLabel,
  current,
}: {
  kind: "photo" | "cv";
  label: string;
  current?: string;
}) {
  const action = kind === "photo" ? uploadPhoto : uploadCv;
  const [state, formAction, pending] = useActionState<LoginState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <span className={label}>{fieldLabel}</span>
        <p className="text-xs text-gray-500 mb-2">
          Actuel : {current ? <span className="text-blue-400">{current}</span> : "fichier par défaut"}
        </p>
        <input
          type="file"
          name="file"
          accept={kind === "cv" ? "application/pdf" : "image/png,image/jpeg,image/webp"}
          required
          className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-gray-200 file:hover:bg-gray-700 file:cursor-pointer"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Envoi…" : "Uploader"}
      </button>
    </form>
  );
}
