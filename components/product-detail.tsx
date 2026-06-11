"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Clock, Tag, ArrowLeft, Check, Shield } from "lucide-react";
import { type Product, formatPrice, getDiscount } from "@/lib/supabase";
import { CheckoutDialog } from "./checkout-dialog";

export function ProductDetail({ product }: { product: Product }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const discount = getDiscount(product.price, product.original_price);
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/#produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"><ArrowLeft className="h-4 w-4" />Voltar ao catálogo</Link>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,0,130,0.08)_0%,transparent_70%)]" />
              <div className="relative flex flex-col items-center text-center">
                <div className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${product.logo_gradient} text-white font-bold text-4xl shadow-2xl transition-transform hover:scale-110`}>{product.logo_icon}</div>
                <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-secondary/80 text-muted-foreground"><Clock className="mr-1 h-3 w-3" />{product.duration}</Badge>
                  {discount && <Badge className="bg-green-600 text-white border-0">-{discount}% OFF</Badge>}
                </div>
              </div>
              {product.featured_content && product.featured_content.length > 0 && (
                <div className="relative mt-8">
                  <Separator className="mb-6 bg-border/50" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Conteúdos em Destaque</h3>
                  <div className="grid grid-cols-2 gap-2">{product.featured_content.map((item, i) => (<div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-sm"><Tag className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" /><span className="text-foreground">{item}</span></div>))}</div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card/80 p-8">
              <div className="space-y-4">
                <div>
                  {product.original_price && product.original_price > product.price && <p className="text-sm text-muted-foreground line-through">De {formatPrice(product.original_price)}</p>}
                  <div className="flex items-baseline gap-2"><span className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</span><span className="text-sm text-muted-foreground">/{product.duration}</span></div>
                </div>
                <Button size="lg" className="w-full gradient-purple border-0 text-white text-base hover:opacity-90 transition-opacity glow-purple-strong" onClick={() => setCheckoutOpen(true)}><ShoppingCart className="mr-2 h-5 w-5" />Comprar Agora</Button>
                <p className="text-center text-xs text-muted-foreground">Pagamento seguro via PIX &bull; Entrega instantânea</p>
              </div>
              <Separator className="my-6 bg-border/50" />
              <div className="space-y-3"><h3 className="font-semibold">Descrição</h3><p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p></div>
              <Separator className="my-6 bg-border/50" />
              <div className="space-y-3">
                <h3 className="font-semibold">O que você recebe</h3>
                {["Acesso completo à plataforma", "Suporte dedicado via WhatsApp", "Ativação em até 30 minutos", "Garantia de satisfação"].map((item) => (<div key={item} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-purple-400 flex-shrink-0" />{item}</div>))}
              </div>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
              <div className="flex items-center gap-3"><Shield className="h-8 w-8 text-purple-400" /><div><h3 className="font-semibold">Compra Segura</h3><p className="text-xs text-muted-foreground mt-0.5">Pagamento processado via Mercado Pago com proteção ao comprador.</p></div></div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutDialog product={product} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
