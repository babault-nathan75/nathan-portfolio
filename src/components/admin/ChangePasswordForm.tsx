"use client";

import { useActionState } from "react";
import { changePassword, type LoginState } from "@/lib/actions";
import { btnPrimary, card, input, label, sectionTitle } from "@/lib/ui";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(changePassword, {});

  return (
    <form action={formAction} className={`${card} space-y-4`}>
      <h2 className={sectionTitle}>Changer le mot de passe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="current" className={label}>Actuel</label>
          <input id="current" name="current" type="password" required autoComplete="current-password" className={input} />
        </div>
        <div>
          <label htmlFor="next" className={label}>Nouveau (min. 8 car.)</label>
          <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className={input} />
        </div>
        <div>
          <label htmlFor="confirm" className={label}>Confirmation</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={input} />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
          Mot de passe modifié avec succès.
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Enregistrement…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
