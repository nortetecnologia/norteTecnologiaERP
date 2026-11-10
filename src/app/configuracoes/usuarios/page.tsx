import AppLayout from "@/components/layout/AppLayout";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import UsersClient from "./UsersClient";

export default async function UsuariosERPPage() {
  const { userId: currentUserId } = await requireAdmin();

  const supabase = createAdminClient();

  const { data: roles = [] } = await supabase
    .from("erp_user_roles")
    .select("user_id, role, created_at")
    .order("created_at");

  const { data: authData } = await supabase.auth.admin.listUsers();
  const authMap = new Map(authData?.users.map((u) => [u.id, u]) ?? []);

  const users = roles.map((r) => ({
    userId: r.user_id,
    role: r.role as "admin" | "operador",
    createdAt: r.created_at,
    email: authMap.get(r.user_id)?.email ?? "—",
  }));

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <a href="/configuracoes" className="text-gray-500 hover:text-gray-300 text-sm">
            ← Configurações
          </a>
          <span className="text-gray-600">/</span>
          <h1 className="text-xl font-bold text-white">Usuários ERP</h1>
        </div>
        <UsersClient users={users} currentUserId={currentUserId} formatDate={formatDate} />
      </div>
    </AppLayout>
  );
}
