"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/produtos", label: "Produtos", icon: "📦" },
  { href: "/estoque", label: "Estoque", icon: "🗄" },
  { href: "/os", label: "Ordens de Serviço", icon: "🔧" },
  { href: "/pdv", label: "PDV", icon: "🛒" },
  { href: "/configuracoes", label: "Configurações", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-brand-gray-dark border-r border-brand-gray-mid flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-gray-mid">
        <div className="w-8 h-8 bg-brand-yellow rounded flex items-center justify-center font-black text-brand-black text-sm">
          NT
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-tight">Norte Tecnologia</div>
          <div className="text-xs text-gray-500">ERP</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-brand-yellow/10 text-brand-yellow border-r-2 border-brand-yellow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-brand-gray-mid">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-sm text-gray-400 hover:text-white py-2 px-4 rounded hover:bg-white/5 transition-colors text-left flex items-center gap-3"
          >
            <span>🚪</span> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
