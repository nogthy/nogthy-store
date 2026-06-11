"use client";

import { Zap, Headphones, QrCode, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Entrega Rápida", description: "Receba sua assinatura em minutos após a confirmação do pagamento." },
  { icon: Headphones, title: "Suporte ao Cliente", description: "Atendimento dedicado via WhatsApp para ajudar você." },
  { icon: QrCode, title: "Pagamento via PIX", description: "Pague de forma segura e instantânea com PIX." },
  { icon: TrendingUp, title: "Excelente Custo-Benefício", description: "Economize até 50% comparado aos preços oficiais." },
];

export function BenefitsSection() {
  return (
    <section className="border-y border-border/30 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="group flex items-start gap-4 rounded-xl border border-border/30 bg-background/50 p-5 transition-all hover:border-purple-500/30 hover:bg-card/50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg gradient-purple text-white transition-colors"><b.icon className="h-5 w-5" /></div>
              <div>
                <h3 className="font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
