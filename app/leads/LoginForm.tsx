"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock } from "lucide-react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="w-full max-w-sm">
      <div className="flex items-center gap-3 text-white/70">
        <Lock strokeWidth={1.4} className="h-4 w-4" />
        <span className="text-[0.68rem] uppercase tracking-[0.28em]">
          Espace privé
        </span>
      </div>

      <h1 className="mt-5 font-display text-3xl font-light text-white">
        Leads Perfecta
      </h1>
      <p className="mt-3 text-sm text-white/55">
        Entrez le code d&apos;accès pour consulter les demandes.
      </p>

      <label htmlFor="code" className="sr-only">
        Code d&apos;accès
      </label>
      <input
        id="code"
        name="code"
        type="password"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        className="mt-8 w-full border border-white/20 bg-white/5 px-4 py-4 text-center font-display text-2xl tracking-[0.5em] text-white outline-none transition-colors focus:border-azur"
      />

      {state.error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full bg-azur px-6 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-white transition-colors hover:bg-azur-hover cursor-pointer focus-azur disabled:opacity-60"
    >
      {pending ? "Vérification…" : "Accéder"}
    </button>
  );
}
