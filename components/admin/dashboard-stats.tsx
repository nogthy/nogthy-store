"use client";

import { type Product, type Order, type Payment, formatPrice } from "@/lib/supabase";
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react";

export function DashboardStats({ products, orders, payments }: { products: Product[]; orders: Order[]; payments: Payment[] }) {
  const totalRevenue = orders.filter((o) => o.status === "paid" || o.status === "delivered").reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const paidOrders = orders.filter((o) => o.status === "paid").length;
  const stats = [
    { label: "Produtos Ativos", value: products.filter((p) => p.active).length, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Receita Total", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Pedidos Pendentes", value: pendingOrders, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "Pedidos Pagos", value: paidOrders, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map((s) => (<div key={s.label} className={`rounded-xl border ${s.bg} p-5`}><div className="flex items-center gap-3"><s.icon className={`h-5 w-5 ${s.color}`} /><span className="text-sm text-muted-foreground">{s.label}</span></div><p className="mt-2 text-2xl font-bold">{s.value}</p></div>))}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card/50 p-6">
          <h3 className="font-semibold mb-4">Pedidos Recentes</h3>
          {orders.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p> : (
            <div className="space-y-3">{orders.slice(0, 5).map((order) => (<div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3"><div className="min-w-0"><p className="text-sm font-medium truncate">{order.customer_name}</p><p className="text-xs text-muted-foreground truncate">{order.products?.name || "Produto"}</p></div><div className="flex items-center gap-2 flex-shrink-0 ml-3"><span className="text-sm font-semibold">{formatPrice(order.total)}</span><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "paid" ? "bg-green-600/20 text-green-400" : order.status === "pending" ? "bg-yellow-600/20 text-yellow-400" : "bg-red-600/20 text-red-400"}`}>{order.status === "paid" ? "Pago" : order.status === "pending" ? "Pendente" : order.status}</span></div></div>))}</div>
          )}
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-6">
          <h3 className="font-semibold mb-4">Pagamentos Recentes</h3>
          {payments.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum pagamento ainda.</p> : (
            <div className="space-y-3">{payments.slice(0, 5).map((payment) => (<div key={payment.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3"><div className="min-w-0"><p className="text-sm font-medium truncate">{payment.provider === "mercado_pago" ? "Mercado Pago" : payment.provider}</p><p className="text-xs text-muted-foreground">{new Date(payment.created_at).toLocaleDateString("pt-BR")}</p></div><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${payment.status === "approved" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}`}>{payment.status === "approved" ? "Aprovado" : payment.status}</span></div>))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
