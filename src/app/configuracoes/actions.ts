"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveSettings(prevState: unknown, formData: FormData) {
  const anonClient = await createClient();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const supabase = createAdminClient();

  const payload = {
    store_name: (formData.get("store_name") as string)?.trim(),
    cnpj: (formData.get("cnpj") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 5,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase.from("store_settings").select("id").single();

  if (existing) {
    const { error } = await supabase
      .from("store_settings")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("store_settings").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/configuracoes");
  return { success: true };
}
