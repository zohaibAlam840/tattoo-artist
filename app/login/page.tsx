"use client";
import { useState, useTransition } from "react";
import Monogram from "@/components/Monogram";
import Wordmark from "@/components/Wordmark";
import { loginAction } from "@/app/actions/auth";

export default function Login() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#EAE5DF" }}>
      <div className="flex flex-col items-center mb-10">
        <Monogram size={180} />
        <div className="mt-4">
          <Wordmark width={240} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">E-mail</label>
          <input
            name="email" type="email" required placeholder="seu@email.com"
            className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">Senha</label>
          <input
            name="password" type="password" required placeholder="••••••••"
            className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
          />
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <button
          type="submit" disabled={isPending}
          className="w-full text-white py-4 rounded-full text-base font-medium mt-2 disabled:opacity-60"
          style={{ background: "#3A4A3B" }}
        >
          {isPending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
