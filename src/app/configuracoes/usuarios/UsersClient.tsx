"use client";

import { useState, useTransition } from "react";
import { addERPUser, removeERPUser, updateERPUserRole } from "../actions";

interface ERPUser {
  userId: string;
  role: "admin" | "operador";
  createdAt: string;
  email: string;
}

interface Props {
  users: ERPUser[];
  currentUserId: string;
  formatDate: (d: string) => string;
}

export default function UsersClient({ users: initial, currentUserId, formatDate }: Props) {
  const [users, setUsers] = useState(initial);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<"admin" | "operador">("operador");
  const [addError, setAddError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", addEmail);
      fd.set("role", addRole);
      const result = await addERPUser(fd);
      if (result?.error) {
        setAddError(result.error);
      } else {
        setAddEmail("");
        // Refresh page to show new user
        window.location.reload();
      }
    });
  }

  function handleRoleChange(userId: string, newRole: string) {
    startTransition(async () => {
      await updateERPUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, role: newRole as "admin" | "operador" } : u
        )
      );
    });
  }

  function handleRemove(userId: string, email: string) {
    if (!confirm(`Remover acesso de ${email}?`)) return;
    startTransition(async () => {
      await removeERPUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    });
  }

  return (
    <>
      {/* Users table */}
      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-brand-gray-mid">
          <h2 className="text-sm font-semibold text-white">Usuários com acesso</h2>
        </div>
        {users.length === 0 ? (
          <p className="text-sm text-gray-500 p-5">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-gray-mid text-xs text-gray-500 uppercase">
                <th className="text-left px-5 py-3">E-mail</th>
                <th className="text-left px-5 py-3">Papel</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Desde</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.userId}
                  className="border-t border-brand-gray-mid hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-3 text-white">
                    {u.email}
                    {u.userId === currentUserId && (
                      <span className="ml-2 text-xs text-brand-yellow">(você)</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {u.userId === currentUserId ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow">
                        admin
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                        disabled={isPending}
                        className="bg-brand-gray-mid border border-brand-gray-light rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-yellow disabled:opacity-50"
                      >
                        <option value="operador">Operador</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.userId !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleRemove(u.userId, u.email)}
                        disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add user */}
      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Adicionar usuário</h2>
        {addError && (
          <div className="mb-3 text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
            {addError}
          </div>
        )}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            required
            placeholder="email@exemplo.com"
            className="flex-1 bg-brand-gray-mid border border-brand-gray-light rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow"
          />
          <select
            value={addRole}
            onChange={(e) => setAddRole(e.target.value as "admin" | "operador")}
            className="bg-brand-gray-mid border border-brand-gray-light rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
          >
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black font-bold px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {isPending ? "Adicionando..." : "Adicionar"}
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-3">
          O usuário precisa ter conta no sistema (mesmo Supabase do site).
        </p>
      </div>
    </>
  );
}
