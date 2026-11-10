"use client";

import { useState } from "react";
import { useActionState } from "react";
import { saveSettings } from "./actions";

const DEFAULT_PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"];

export default function ConfigForm({ settings }: { settings: any }) {
  const [state, action, isPending] = useActionState(saveSettings, null);

  const initialMethods: string[] =
    settings?.payment_methods?.length > 0
      ? settings.payment_methods
      : DEFAULT_PAYMENT_METHODS;

  const [methods, setMethods] = useState<string[]>(initialMethods);
  const [newMethod, setNewMethod] = useState("");

  function addMethod() {
    const trimmed = newMethod.trim();
    if (!trimmed || methods.includes(trimmed)) return;
    setMethods((prev) => [...prev, trimmed]);
    setNewMethod("");
  }

  function removeMethod(idx: number) {
    setMethods((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <form action={action} className="space-y-6">
      {state?.success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm rounded-xl px-4 py-3">
          Configurações salvas com sucesso.
        </div>
      )}
      {state?.error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      {/* Hidden inputs for payment methods array */}
      {methods.map((m, i) => (
        <input key={i} type="hidden" name="payment_method[]" value={m} />
      ))}

      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-5 space-y-4">
        <div className="text-sm font-semibold text-gray-300">Dados da empresa</div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Nome da empresa</label>
          <input
            type="text"
            name="store_name"
            defaultValue={settings?.store_name ?? "Norte Tecnologia"}
            className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-yellow"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">WhatsApp / Telefone</label>
            <input
              type="text"
              name="whatsapp_number"
              defaultValue={settings?.whatsapp_number ?? ""}
              placeholder="(95) 99999-9999"
              className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              defaultValue={settings?.email ?? ""}
              placeholder="contato@empresa.com"
              className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Endereço</label>
          <input
            type="text"
            name="address"
            defaultValue={settings?.address ?? ""}
            className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Cidade</label>
            <input
              type="text"
              name="city"
              defaultValue={settings?.city ?? ""}
              className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Estado (UF)</label>
            <input
              type="text"
              name="state_abbr"
              defaultValue={settings?.state_abbr ?? ""}
              maxLength={2}
              placeholder="RR"
              className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>
      </div>

      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-5 space-y-4">
        <div className="text-sm font-semibold text-gray-300">Formas de pagamento</div>
        <p className="text-xs text-gray-500">Métodos disponíveis no PDV.</p>

        <div className="space-y-2">
          {methods.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between bg-brand-gray-mid rounded-lg px-3 py-2">
              <span className="text-sm text-white">{m}</span>
              <button
                type="button"
                onClick={() => removeMethod(idx)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors ml-3"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMethod(); } }}
            placeholder="Nova forma de pagamento..."
            className="flex-1 bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
          />
          <button
            type="button"
            onClick={addMethod}
            className="px-4 py-2 bg-brand-gray-mid border border-brand-gray-light text-sm text-gray-300 hover:text-brand-yellow rounded-lg transition-colors"
          >
            + Adicionar
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
