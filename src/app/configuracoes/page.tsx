import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ConfigForm from "./ConfigForm";

export default async function ConfiguracoesPage() {
  const anonClient = await createClient();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/login");

  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>
        <ConfigForm settings={settings} />
      </div>
    </AppLayout>
  );
}
