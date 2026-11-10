import AppLayout from "@/components/layout/AppLayout";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import ConfigForm from "./ConfigForm";

export default async function ConfiguracoesPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <a
            href="/configuracoes/usuarios"
            className="text-sm text-brand-yellow hover:text-brand-yellow-dark transition-colors"
          >
            👥 Usuários ERP
          </a>
        </div>
        <ConfigForm settings={settings} />
      </div>
    </AppLayout>
  );
}
