"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function saveSettings(prevState: unknown, formData: FormData) {
  await requireAdmin();
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

export async function addERPUser(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = (formData.get("role") as string) || "operador";

  if (!email) return { error: "E-mail é obrigatório." };
  if (!["admin", "operador"].includes(role)) return { error: "Papel inválido." };

  // Find user by email via admin auth API
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return { error: listError.message };

  const targetUser = users.users.find((u) => u.email === email);
  if (!targetUser) return { error: "Usuário não encontrado. Verifique o e-mail." };

  const { error } = await supabase.from("erp_user_roles").upsert(
    { user_id: targetUser.id, role },
    { onConflict: "user_id" }
  );
  if (error) return { error: error.message };

  revalidatePath("/configuracoes/usuarios");
  return { success: true };
}

export async function updateERPUserRole(userId: string, role: string) {
  await requireAdmin();
  if (!["admin", "operador"].includes(role)) return { error: "Papel inválido." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("erp_user_roles")
    .update({ role })
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/configuracoes/usuarios");
  return { success: true };
}

export async function removeERPUser(userId: string) {
  const { userId: currentUserId } = await requireAdmin();
  if (userId === currentUserId) return { error: "Você não pode remover seu próprio acesso." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("erp_user_roles")
    .delete()
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}
