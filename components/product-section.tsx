"use client";

import { type Product, type Category } from "@/lib/supabase";
import { ProductCard } from "./product-card";
import { Tv, Music, AppWindow } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = { streaming: Tv, musica: Music, aplicativos: AppWindow };

export function ProductSection({ category, products }: { category: Category; products: Product[] }) {
  const Icon = categoryIcons[category.slug] || Tv;
  return (
    <section id={category.slug} className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-purple text-white"><Icon className="h-5 w-5" /></div>
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{category.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}</p>
          </div>
          <div className="ml-auto h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (<ProductCard key={product.id} product={product} />))}
        </div>
      </div>
    </section>
  );
}
