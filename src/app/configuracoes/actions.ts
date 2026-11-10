"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function saveSettings(prevState: unknown, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const paymentMethods = formData.getAll("payment_method[]").map((v) => String(v)).filter(Boolean);

  const payload = {
    store_name: (formData.get("store_name") as string)?.trim(),
    whatsapp_number: (formData.get("whatsapp_number") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    state_abbr: (formData.get("state_abbr") as string)?.trim().toUpperCase() || null,
    payment_methods: paymentMethods.length > 0 ? paymentMethods : ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"],
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
