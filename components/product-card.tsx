"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";
import { type Product, formatPrice, getDiscount } from "@/lib/supabase";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscount(product.price, product.original_price);
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5 transition-all duration-300 hover:border-purple-500/40 hover:glow-purple hover:bg-card">
        {discount && <Badge className="absolute top-3 right-3 z-10 bg-green-600 text-white border-0 text-xs px-2 py-0.5">-{discount}%</Badge>}
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product.logo_gradient} text-white font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 overflow-hidden`}>
            {(product as any).image_url ? (
              <img
                src={(product as any).image_url}
                alt={product.name}
                className="w-10 h-10 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              product.logo_icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-purple-300 transition-colors truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{product.duration}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
        {product.featured_content && product.featured_content.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.featured_content.slice(0, 3).map((item, i) => (<span key={i} className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] text-muted-foreground"><Tag className="h-2.5 w-2.5" />{item}</span>))}
          </div>
        )}
        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-0.5">
            {product.original_price && product.original_price > product.price && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price)}</p>}
            <p className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>
          </div>
          <Button size="sm" className="gradient-purple border-0 text-white hover:opacity-90 transition-opacity"><ShoppingCart className="mr-1.5 h-3.5 w-3.5" />Comprar</Button>
        </div>
      </div>
    </Link>
  );
}