"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-purple"><span className="text-lg font-bold text-white">N</span></div>
          <span className="text-xl font-bold tracking-tight">Nogthy<span className="text-purple-400"> Store</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[{ href: "/", label: "Início" }, { href: "/#produtos", label: "Produtos" }, { href: "/#streaming", label: "Streaming" }, { href: "/#musica", label: "Música" }, { href: "/#aplicativos", label: "Aplicativos" }].map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary">{item.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/admin"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Admin</Button></Link>
          <Link href="/#produtos"><Button size="sm" className="gradient-purple border-0 text-white hover:opacity-90 transition-opacity"><ShoppingCart className="mr-2 h-4 w-4" />Ver Produtos</Button></Link>
        </div>
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col p-4 gap-1">
            {[{ href: "/", label: "Início" }, { href: "/#produtos", label: "Produtos" }, { href: "/#streaming", label: "Streaming" }, { href: "/#musica", label: "Música" }, { href: "/#aplicativos", label: "Aplicativos" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary">{item.label}</Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
              <Link href="/admin" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">Admin</Button></Link>
              <Link href="/#produtos" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full gradient-purple border-0 text-white"><ShoppingCart className="mr-2 h-4 w-4" />Ver Produtos</Button></Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
