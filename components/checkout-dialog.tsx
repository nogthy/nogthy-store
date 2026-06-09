"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, QrCode, Copy, Check, CreditCard } from "lucide-react";
import { type Product, formatPrice } from "@/lib/supabase";

type CheckoutStep = "form" | "payment" | "success";

export function CheckoutDialog({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentData, setPaymentData] = useState<{ orderId: string; qrCodeBase64: string; pixCopiaECola: string } | null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ productId: product.id, productName: product.name, price: product.price, customerName: form.name, customerEmail: form.email, customerPhone: form.phone }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Erro ao criar pagamento");
      const data = await response.json();
      if (data.qrCodeBase64 || data.pixCopiaECola) {
        setPaymentData({ orderId: data.orderId, qrCodeBase64: data.qrCodeBase64 || "", pixCopiaECola: data.pixCopiaECola || "" });
        setStep("payment");
      } else if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        setStep("success");
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error: any) {
      alert(error.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setStep("form"); setForm({ name: "", email: "", phone: "" }); setPaymentData(null); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-purple-400" />{step === "form" ? "Finalizar Compra" : step === "payment" ? "Pagamento PIX" : "Pedido Realizado!"}</DialogTitle></DialogHeader>
        {step === "form" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${product.logo_gradient} text-white font-bold text-sm`}>{product.logo_icon}</div>
              <div className="flex-1 min-w-0"><p className="font-medium truncate">{product.name}</p><p className="text-sm text-muted-foreground">{product.duration}</p></div>
              <p className="font-bold text-lg">{formatPrice(product.price)}</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Nome completo</Label><Input id="name" placeholder="Seu nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label htmlFor="phone">WhatsApp</Label><Input id="phone" type="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="bg-background/50 border-border/50" /></div>
            </div>
            <Button size="lg" className="w-full gradient-purple border-0 text-white hover:opacity-90 transition-opacity" onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.phone}>{loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processando...</> : <><QrCode className="mr-2 h-5 w-5" />Pagar via PIX</>}</Button>
          </div>
        )}
        {step === "payment" && paymentData && (
          <div className="space-y-5">
            <div className="flex flex-col items-center">
              {paymentData.qrCodeBase64 ? <div className="rounded-xl bg-white p-3"><img src={`data:image/png;base64,${paymentData.qrCodeBase64}`} alt="QR Code PIX" className="h-52 w-52" /></div> : <div className="flex h-52 w-52 items-center justify-center rounded-xl bg-white p-3"><QrCode className="h-32 w-32 text-black" /></div>}
              <p className="mt-3 text-sm text-muted-foreground">Escaneie o QR Code com seu banco</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="space-y-2"><Label className="text-sm">PIX Copia e Cola</Label><div className="flex gap-2"><Input readOnly value={paymentData.pixCopiaECola} className="bg-background/50 border-border/50 text-xs font-mono" /><Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(paymentData.pixCopiaECola); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-shrink-0 border-purple-500/30 hover:bg-purple-500/10">{copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}</Button></div></div>
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3"><p className="text-xs text-yellow-200">Após o pagamento, a confirmação é automática em até 5 minutos. Seu acesso será enviado por e-mail e WhatsApp.</p></div>
            <Button variant="outline" className="w-full border-border/50" onClick={handleClose}>Fechar</Button>
          </div>
        )}
        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-purple text-white"><Check className="h-8 w-8" /></div>
            <h3 className="text-xl font-bold text-center">Redirecionado para pagamento!</h3>
            <p className="text-sm text-muted-foreground text-center">Complete o pagamento na janela do Mercado Pago. Após a confirmação, você receberá seu acesso por e-mail.</p>
            <Button variant="outline" className="border-border/50" onClick={handleClose}>Fechar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
