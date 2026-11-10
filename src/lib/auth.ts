import { createAdminClient } from "./supabase/admin";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type ERPRole = "admin" | "operador";

export async function getUserRole(userId: string): Promise<ERPRole | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("erp_user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  return (data?.role as ERPRole) ?? null;
}

/** Throws redirect to /login if user has no ERP access. */
export async function requireAuth(): Promise<{ userId: string; role: ERPRole }> {
  const anonClient = await createClient();
  const {
    data: { user },
  } = await anonClient.auth.getUser();

  if (!user) redirect("/login");

  const role = await getUserRole(user.id);
  if (!role) redirect("/login?error=unauthorized");

  return { userId: user.id, role };
}

/** Like requireAuth but also demands admin role. */
export async function requireAdmin(): Promise<{ userId: string; role: "admin" }> {
  const { userId, role } = await requireAuth();
  if (role !== "admin") redirect("/login?error=forbidden");
  return { userId, role: "admin" };
}
