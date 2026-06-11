"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, CreditCard, BarChart3 } from "lucide-react";
import { ProductsManager } from "./products-manager";
import { OrdersManager } from "./orders-manager";
import { PaymentsManager } from "./payments-manager";
import { DashboardStats } from "./dashboard-stats";
import { type Product, type Order, type Payment, type Category, supabase } from "@/lib/supabase";

export function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [prodRes, ordRes, payRes, catRes] = await Promise.all([
        supabase.from("products").select("*, categories(*)").order("sort_order"),
        supabase.from("orders").select("*, products(*)").order("created_at", { ascending: false }),
        supabase.from("payments").select("*, orders(*)").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("sort_order"),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (ordRes.data) setOrders(ordRes.data);
      if (payRes.data) setPayments(payRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="mt-1 text-muted-foreground">Gerencie produtos, pedidos e pagamentos da Nogthy Store</p>
        </div>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="dashboard" className="gap-2"><BarChart3 className="h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="products" className="gap-2"><Package className="h-4 w-4" />Produtos</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><ShoppingCart className="h-4 w-4" />Pedidos</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="h-4 w-4" />Pagamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><DashboardStats products={products} orders={orders} payments={payments} /></TabsContent>
          <TabsContent value="products"><ProductsManager products={products} categories={categories} onRefresh={loadData} /></TabsContent>
          <TabsContent value="orders"><OrdersManager orders={orders} onRefresh={loadData} /></TabsContent>
          <TabsContent value="payments"><PaymentsManager payments={payments} onRefresh={loadData} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
