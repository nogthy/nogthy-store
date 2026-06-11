"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(75,0,130,0.2)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(107,33,168,0.1)_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-8"><Sparkles className="h-4 w-4" />Assinaturas Premium</div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">Economize com suas <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">assinaturas favoritas</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">Streamings, músicas e aplicativos premium por preços acessíveis. Pagamento seguro via PIX com entrega instantânea.</p>
          <div className="mt-10"><a href="#produtos"><Button size="lg" className="gradient-purple border-0 text-white px-8 text-base hover:opacity-90 transition-opacity glow-purple">Ver Produtos<ArrowDown className="ml-2 h-5 w-5" /></Button></a></div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[{ value: "13+", label: "Produtos" }, { value: "50%", label: "Desconto" }, { value: "PIX", label: "Pagamento" }, { value: "24h", label: "Suporte" }].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 px-6 py-4">
                <div className="text-2xl font-bold text-purple-300">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
