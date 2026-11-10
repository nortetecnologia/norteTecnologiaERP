"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer, updateCustomer } from "./actions";
import type { Customer } from "@/types";

interface Props {
  customer?: Customer;
}

type State = { error?: string; success?: boolean } | null;

export default function CustomerForm({ customer }: Props) {
  const router = useRouter();

  const action = customer
    ? async (_: State, formData: FormData) => {
        const result = await updateCustomer(customer.id, formData);
        if (result.success) router.push(`/clientes/${customer.id}`);
        return result;
      }
    : async (_: State, formData: FormData) => {
        const result = await createCustomer(formData);
        if (result.success) router.push("/clientes");
        return result;
      };

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {state.error}
        </div>
      )}

      <Field label="Nome *" name="name" defaultValue={customer?.name} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Telefone" name="phone" defaultValue={customer?.phone} placeholder="(95) 99999-9999" />
        <Field label="E-mail" name="email" type="email" defaultValue={customer?.email} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="CPF / CNPJ" name="cpf_cnpj" defaultValue={customer?.cpf_cnpj} />
        <Field label="Cidade" name="city" defaultValue={customer?.city} />
      </div>
      <Field label="Endereço" name="address" defaultValue={customer?.address} />
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Observações</label>
        <textarea
          name="notes"
          defaultValue={customer?.notes ?? ""}
          rows={3}
          className="w-full bg-brand-gray-dark border border-brand-gray-mid rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-yellow resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {isPending ? "Salvando..." : customer ? "Salvar alterações" : "Criar cliente"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm text-gray-400 hover:text-white border border-brand-gray-mid rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="w-full bg-brand-gray-dark border border-brand-gray-mid rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-yellow transition-colors"
      />
    </div>
  );
}
