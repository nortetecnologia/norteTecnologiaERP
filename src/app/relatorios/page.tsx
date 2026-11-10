import { redirect } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

function startOf(unit: "day" | "week" | "month") {
  const d = new Date();
  if (unit === "day") {
    d.setHours(0, 0, 0, 0);
  } else if (unit === "week") {
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
  } else {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString();
}

const PAYMENT_LABELS: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito_1x: "Crédito 1x",
  credito_2x: "Crédito 2x",
  credito_3x: "Crédito 3x",
  credito_6x: "Crédito 6x",
  credito_12x: "Crédito 12x",
};

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const anonClient = await createClient();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/login");

  const { periodo = "mes" } = await searchParams;
  const unit = periodo === "hoje" ? "day" : periodo === "semana" ? "week" : "month";
  const since = startOf(unit);

  const supabase = createAdminClient();

  const [
    salesRes,
    paymentsRes,
    saleItemsRes,
    osRes,
    osStatusRes,
  ] = await Promise.all([
    supabase
      .from("erp_pdv_sales")
      .select("id, total, discount, created_at")
      .gte("created_at", since),
    supabase
      .from("erp_pdv_sale_payments")
      .select("method, amount, erp_pdv_sales!inner(created_at)")
      .gte("erp_pdv_sales.created_at", since),
    supabase
      .from("erp_pdv_sale_items")
      .select("description, quantity, subtotal, erp_pdv_sales!inner(created_at)")
      .gte("erp_pdv_sales.created_at", since),
    supabase
      .from("erp_service_orders")
      .select("id, labor_cost, discount, erp_service_order_items(quantity, unit_price)")
      .gte("created_at", since)
      .neq("status", "cancelled"),
    supabase
      .from("erp_service_orders")
      .select("status")
      .gte("created_at", since),
  ]);

  const sales = salesRes.data ?? [];
  const payments = paymentsRes.data ?? [];
  const saleItems = saleItemsRes.data ?? [];
  const osList = osRes.data ?? [];
  const osStatuses = osStatusRes.data ?? [];

  // PDV totals
  const pdvTotal = sales.reduce((s, v) => s + (v.total ?? 0), 0);
  const pdvCount = sales.length;
  const pdvTicket = pdvCount > 0 ? pdvTotal / pdvCount : 0;

  // OS totals
  const osTotal = osList.reduce((s, o: any) => {
    const items = (o.erp_service_order_items ?? []).reduce(
      (si: number, i: any) => si + i.quantity * i.unit_price, 0
    );
    return s + items + (o.labor_cost ?? 0) - (o.discount ?? 0);
  }, 0);
  const osCount = osList.length;

  // Payment breakdown
  const paymentByMethod: Record<string, number> = {};
  for (const p of payments) {
    const method = (p as any).method as string;
    paymentByMethod[method] = (paymentByMethod[method] ?? 0) + ((p as any).amount ?? 0);
  }
  const paymentEntries = Object.entries(paymentByMethod).sort((a, b) => b[1] - a[1]);

  // Top products
  const productTotals: Record<string, { qty: number; total: number }> = {};
  for (const item of saleItems) {
    const desc = (item as any).description as string;
    if (!productTotals[desc]) productTotals[desc] = { qty: 0, total: 0 };
    productTotals[desc].qty += (item as any).quantity ?? 1;
    productTotals[desc].total += (item as any).subtotal ?? 0;
  }
  const topProducts = Object.entries(productTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  // OS by status
  const statusCount: Record<string, number> = {};
  for (const o of osStatuses) {
    statusCount[o.status] = (statusCount[o.status] ?? 0) + 1;
  }

  const OS_LABELS: Record<string, string> = {
    awaiting: "Aguardando",
    in_progress: "Em andamento",
    done: "Concluída",
    delivered: "Entregue",
    cancelled: "Cancelada",
  };

  const periodos = [
    { value: "hoje", label: "Hoje" },
    { value: "semana", label: "Esta semana" },
    { value: "mes", label: "Este mês" },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <div className="flex gap-2">
            {periodos.map((p) => (
              <Link
                key={p.value}
                href={`/relatorios?periodo=${p.value}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  periodo === p.value
                    ? "bg-brand-yellow text-brand-black border-brand-yellow font-bold"
                    : "text-gray-400 border-brand-gray-mid hover:border-gray-400"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Receita PDV", value: formatCurrency(pdvTotal), color: "text-green-400" },
            { label: "Vendas PDV", value: String(pdvCount), color: "text-blue-400" },
            { label: "Ticket médio", value: formatCurrency(pdvTicket), color: "text-brand-yellow" },
            { label: "OS faturadas", value: formatCurrency(osTotal), color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-5">
              <div className="text-xs text-gray-500 mb-2">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment methods */}
          <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl">
            <div className="px-5 py-3 border-b border-brand-gray-mid text-sm font-semibold text-gray-300">
              Formas de pagamento
            </div>
            {paymentEntries.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-600">Sem pagamentos neste período.</p>
            ) : (
              <div className="p-5 space-y-3">
                {paymentEntries.map(([method, amount]) => {
                  const pct = pdvTotal > 0 ? (amount / pdvTotal) * 100 : 0;
                  return (
                    <div key={method}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{PAYMENT_LABELS[method] ?? method}</span>
                        <span className="text-white font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-brand-gray-mid rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-yellow rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* OS by status */}
          <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl">
            <div className="px-5 py-3 border-b border-brand-gray-mid text-sm font-semibold text-gray-300">
              Ordens de Serviço ({osCount}) — {" "}
              <span className="text-gray-500 font-normal">
                {periodo === "hoje" ? "hoje" : periodo === "semana" ? "esta semana" : "este mês"}
              </span>
            </div>
            {Object.keys(statusCount).length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-600">Sem OS neste período.</p>
            ) : (
              <div className="p-5 space-y-2">
                {Object.entries(statusCount).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{OS_LABELS[status] ?? status}</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-xl">
          <div className="px-5 py-3 border-b border-brand-gray-mid text-sm font-semibold text-gray-300">
            Produtos mais vendidos (PDV)
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-600">Sem vendas neste período.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left px-5 py-2">#</th>
                  <th className="text-left px-5 py-2">Produto</th>
                  <th className="text-right px-5 py-2">Qtd</th>
                  <th className="text-right px-5 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(([desc, { qty, total }], i) => (
                  <tr key={desc} className="border-t border-brand-gray-mid hover:bg-white/5">
                    <td className="px-5 py-2.5 text-gray-500 w-8">{i + 1}</td>
                    <td className="px-5 py-2.5 text-white">{desc}</td>
                    <td className="px-5 py-2.5 text-right text-gray-300">{qty}</td>
                    <td className="px-5 py-2.5 text-right text-brand-yellow font-medium">{formatCurrency(total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
