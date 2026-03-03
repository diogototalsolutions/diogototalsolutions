"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  honey: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
  honey: "",
};

export default function ContactoPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setWarningMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "Não foi possível enviar o pedido. Tente novamente.");
        return;
      }

      setSuccessMessage(data?.message || "Pedido enviado com sucesso.");
      if (data?.warning) {
        setWarningMessage(data.warning);
      }
      setForm(initialState);
    } catch {
      setErrorMessage("Ocorreu um erro de ligação. Verifique a internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-brand">Contacto</h1>
      <p className="text-slate-700">Preencha o formulário para pedidos de informação ou orçamento.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.honey}
          onChange={(event) => setForm((prev) => ({ ...prev, honey: event.target.value }))}
          className="hidden"
          aria-hidden="true"
          name="website"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Nome *
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="O seu nome"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Empresa
            <input
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Nome da empresa"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Email *
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="email@empresa.com"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Telefone
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="+351 ..."
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Assunto *
          <input
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Ex: Pedido de orçamento para website"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mensagem *
          <textarea
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="mt-1 min-h-32 w-full rounded-md border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))}
            required
          />
          Concordo com o tratamento dos dados para resposta ao meu pedido. *
        </label>

        {successMessage ? <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</p> : null}
        {warningMessage ? <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">{warningMessage}</p> : null}
        {errorMessage ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "A enviar..." : "Enviar pedido"}
        </button>
      </form>
    </div>
  );
}
