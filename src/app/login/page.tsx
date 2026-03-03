"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const next = requestedNext && requestedNext.startsWith("/") ? requestedNext : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setErrorMessage("Credenciais inválidas.");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-brand">Login Admin</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-md border px-3 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</p> : null}
        <button className="w-full rounded-full bg-brand px-4 py-2 font-semibold text-white" type="submit">Entrar</button>
      </form>
    </div>
  );
}
