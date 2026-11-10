"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getAuth() {
  const anonClient = await createClient();
  const { data: { user }, error } = await anonClient.auth.getUser();
  if (error || !user) throw new Error("Não autorizado.");
  return createAdminClient();
}

export async function saveProduto(prevState: unknown, formData: FormData) {
  const supabase = await getAuth();

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nome é obrigatório." };

  const imageUrl = (formData.get("image_url") as string)?.trim() || null;

  const payload: Record<string, unknown> = {
    name,
    sku: (formData.get("sku") as string)?.trim() || null,
    price: parseFloat(formData.get("price") as string) || 0,
    stock_quantity: parseInt(formData.get("stock_quantity") as string) || 0,
    category_id: (formData.get("category_id") as string) || null,
    description: (formData.get("description") as string)?.trim() || null,
    active: formData.get("active") === "true",
  };

  // Só atualiza image_url se foi enviado algum valor (vazio = remover imagem)
  if (imageUrl !== null) payload.image_url = imageUrl || null;

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/produtos");
  revalidatePath("/pdv");
  redirect("/produtos");
}

export async function deleteProduto(id: string) {
  const supabase = await getAuth();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/produtos");
  redirect("/produtos");
}
