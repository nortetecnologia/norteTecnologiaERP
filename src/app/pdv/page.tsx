import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PDVClient from "./PDVClient";

export default async function PDVPage() {
  const anonClient = await createClient();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/login");

  const supabase = createAdminClient();
  const [{ data: products = [] }, { data: customers = [] }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, sku, stock_quantity, image_url")
      .eq("active", true)
      .order("name"),
    supabase
      .from("erp_customers")
      .select("id, name, phone")
      .order("name"),
  ]);

  return (
    <AppLayout>
      <PDVClient products={products} customers={customers} />
    </AppLayout>
  );
}
