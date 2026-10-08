"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions";
import { btnPrimary, input, label } from "@/lib/ui";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className={label}>
          Adresse email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={input}
          placeholder="vous@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          className={input}
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${btnPrimary} w-full justify-center py-3`}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
