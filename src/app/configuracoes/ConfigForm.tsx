"use client";

import { useActionState } from "react";
import { saveSettings } from "./actions";

export default function ConfigForm({ settings }: { settings: any }) {
  const [state, action, isPending] = useActionState(saveSettings, null);

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
        <div>
          <label className="text-xs text-gray-400 block mb-1">CNPJ</label>
          <input
            type="text"
            name="cnpj"
            defaultValue={settings?.cnpj ?? ""}
            placeholder="00.000.000/0000-00"
            className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
          />
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
        <div>
          <label className="text-xs text-gray-400 block mb-1">Telefone</label>
          <input
            type="text"
            name="phone"
            defaultValue={settings?.phone ?? ""}
            className="w-full bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
          />
        </div>
      </div>

      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-5 space-y-4">
        <div className="text-sm font-semibold text-gray-300">Estoque</div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Alerta de estoque baixo (quantidade mínima)</label>
          <input
            type="number"
            name="low_stock_threshold"
            defaultValue={settings?.low_stock_threshold ?? 5}
            min="1"
            className="w-full max-w-xs bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-yellow"
          />
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
