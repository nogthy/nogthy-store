"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Copy, Check } from "lucide-react";
import { type Payment } from "@/lib/supabase";

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-600/20 text-yellow-400 border-0" },
  approved: { label: "Aprovado", color: "bg-green-600/20 text-green-400 border-0" },
  rejected: { label: "Rejeitado", color: "bg-red-600/20 text-red-400 border-0" },
  cancelled: { label: "Cancelado", color: "bg-gray-600/20 text-gray-400 border-0" },
  refunded: { label: "Reembolsado", color: "bg-blue-600/20 text-blue-400 border-0" },
};

export function PaymentsManager({ payments, onRefresh }: { payments: Payment[]; onRefresh: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Pagamentos</h2><p className="text-sm text-muted-foreground">{payments.length} pagamentos</p></div><Button variant="outline" size="sm" onClick={onRefresh} className="border-border/50"><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button></div>
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border/50 hover:bg-transparent"><TableHead>ID MP</TableHead><TableHead>Cliente</TableHead><TableHead>Provedor</TableHead><TableHead>PIX</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{payments.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum pagamento encontrado</TableCell></TableRow> : payments.map((payment) => { const status = statusMap[payment.status] || statusMap.pending; return (<TableRow key={payment.id} className="border-border/30"><TableCell className="text-xs font-mono text-muted-foreground">{payment.provider_payment_id || "-"}</TableCell><TableCell className="text-sm">{payment.orders?.customer_name || "-"}</TableCell><TableCell className="text-sm text-muted-foreground">{payment.provider === "mercado_pago" ? "Mercado Pago" : payment.provider}</TableCell><TableCell>{payment.pix_copia_cola ? <Button variant="ghost" size="sm" onClick={() => handleCopy(payment.pix_copia_cola!, payment.id)} className="h-7 text-xs text-purple-400 hover:text-purple-300">{copiedId === payment.id ? <><Check className="mr-1 h-3 w-3" />Copiado</> : <><Copy className="mr-1 h-3 w-3" />Copiar PIX</>}</Button> : <span className="text-xs text-muted-foreground">-</span>}</TableCell><TableCell className="text-sm text-muted-foreground">{new Date(payment.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell><TableCell><Badge className={status.color}>{status.label}</Badge></TableCell></TableRow>); })}</TableBody>
        </Table>
      </div>
    </div>
  );
}
