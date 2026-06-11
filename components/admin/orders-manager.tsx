"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { type Order, updateOrder, formatPrice } from "@/lib/supabase";

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-600/20 text-yellow-400 border-0" },
  paid: { label: "Pago", color: "bg-green-600/20 text-green-400 border-0" },
  delivered: { label: "Entregue", color: "bg-blue-600/20 text-blue-400 border-0" },
  cancelled: { label: "Cancelado", color: "bg-red-600/20 text-red-400 border-0" },
};

export function OrdersManager({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const handleStatusChange = async (orderId: string, newStatus: string) => { try { await updateOrder(orderId, { status: newStatus as Order["status"] }); onRefresh(); } catch { alert("Erro ao atualizar status."); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Pedidos</h2><p className="text-sm text-muted-foreground">{orders.length} pedidos</p></div><Button variant="outline" size="sm" onClick={onRefresh} className="border-border/50"><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button></div>
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border/50 hover:bg-transparent"><TableHead>Cliente</TableHead><TableHead>Produto</TableHead><TableHead>Total</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{orders.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum pedido encontrado</TableCell></TableRow> : orders.map((order) => { const status = statusMap[order.status] || statusMap.pending; return (<TableRow key={order.id} className="border-border/30"><TableCell><div><p className="font-medium text-sm">{order.customer_name}</p><p className="text-xs text-muted-foreground">{order.customer_email}</p>{order.customer_phone && <p className="text-xs text-muted-foreground">{order.customer_phone}</p>}</div></TableCell><TableCell><div className="flex items-center gap-2">{order.products && <div className={`flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br ${order.products.logo_gradient} text-white text-[10px] font-bold`}>{order.products.logo_icon}</div>}<span className="text-sm">{order.products?.name || "-"}</span></div></TableCell><TableCell className="font-semibold">{formatPrice(order.total)}</TableCell><TableCell className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell><TableCell><Badge className={status.color}>{status.label}</Badge></TableCell><TableCell className="text-right"><Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}><SelectTrigger className="h-8 w-32 bg-background/50 border-border/50 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pendente</SelectItem><SelectItem value="paid">Pago</SelectItem><SelectItem value="delivered">Entregue</SelectItem><SelectItem value="cancelled">Cancelado</SelectItem></SelectContent></Select></TableCell></TableRow>); })}</TableBody>
        </Table>
      </div>
    </div>
  );
}
