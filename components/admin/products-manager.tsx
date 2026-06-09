"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { type Product, type Category, updateProduct, createProduct, deleteProduct, formatPrice, getDiscount } from "@/lib/supabase";

export function ProductsManager({ products, categories, onRefresh }: { products: Product[]; categories: Category[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", category_id: "", price: "", original_price: "", duration: "1 mês", description: "", logo_color: "#4B0082", logo_gradient: "from-purple-700 to-purple-900", logo_icon: "?", stock: "-1", active: true, sort_order: "0", featured_content: "[]" });

  const openEdit = (product: Product) => { setEditing(product); setIsNew(false); setForm({ name: product.name, slug: product.slug, category_id: product.category_id, price: String(product.price), original_price: product.original_price ? String(product.original_price) : "", duration: product.duration, description: product.description, logo_color: product.logo_color, logo_gradient: product.logo_gradient, logo_icon: product.logo_icon, stock: String(product.stock), active: product.active, sort_order: String(product.sort_order), featured_content: JSON.stringify(product.featured_content || []) }); };
  const openNew = () => { setEditing(null); setIsNew(true); setForm({ name: "", slug: "", category_id: categories[0]?.id || "", price: "", original_price: "", duration: "1 mês", description: "", logo_color: "#4B0082", logo_gradient: "from-purple-700 to-purple-900", logo_icon: "?", stock: "-1", active: true, sort_order: "0", featured_content: "[]" }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), category_id: form.category_id, price: parseFloat(form.price) || 0, original_price: form.original_price ? parseFloat(form.original_price) : null, duration: form.duration, description: form.description, logo_color: form.logo_color, logo_gradient: form.logo_gradient, logo_icon: form.logo_icon, stock: parseInt(form.stock) || -1, active: form.active, sort_order: parseInt(form.sort_order) || 0, featured_content: JSON.parse(form.featured_content || "[]") };
      if (isNew) { await createProduct(data as any); } else if (editing) { await updateProduct(editing.id, data); }
      setEditing(null); setIsNew(false); onRefresh();
    } catch { alert("Erro ao salvar produto."); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Tem certeza que deseja excluir este produto?")) return; try { await deleteProduct(id); onRefresh(); } catch { alert("Erro ao excluir produto."); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Produtos</h2><p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p></div><Button onClick={openNew} size="sm" className="gradient-purple border-0 text-white"><Plus className="mr-2 h-4 w-4" />Novo Produto</Button></div>
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border/50 hover:bg-transparent"><TableHead>Produto</TableHead><TableHead>Categoria</TableHead><TableHead>Preço</TableHead><TableHead>Estoque</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{products.map((product) => { const discount = getDiscount(product.price, product.original_price); const cat = categories.find((c) => c.id === product.category_id); return (<TableRow key={product.id} className="border-border/30"><TableCell><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${product.logo_gradient} text-white text-xs font-bold`}>{product.logo_icon}</div><span className="font-medium">{product.name}</span></div></TableCell><TableCell className="text-muted-foreground">{cat?.name || "-"}</TableCell><TableCell><div><span className="font-semibold">{formatPrice(product.price)}</span>{discount && <Badge className="ml-2 bg-green-600/20 text-green-400 border-0 text-xs">-{discount}%</Badge>}</div></TableCell><TableCell className="text-muted-foreground">{product.stock === -1 ? "Ilimitado" : product.stock}</TableCell><TableCell><Badge className={product.active ? "bg-green-600/20 text-green-400 border-0" : "bg-red-600/20 text-red-400 border-0"}>{product.active ? "Ativo" : "Inativo"}</Badge></TableCell><TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="h-8 w-8 text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-muted-foreground hover:text-red-400"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>); })}</TableBody>
        </Table>
      </div>
      <Dialog open={!!editing || isNew} onOpenChange={(open) => { if (!open) { setEditing(null); setIsNew(false); } }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>{isNew ? "Novo Produto" : `Editar: ${editing?.name}`}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Preço Original</Label><Input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm((p) => ({ ...p, original_price: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Categoria</Label><Select value={form.category_id} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}><SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Duração</Label><Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Estoque (-1 = ilimitado)</Label><Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Ícone do Logo</Label><Input value={form.logo_icon} onChange={(e) => setForm((p) => ({ ...p, logo_icon: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2"><Label>Gradiente</Label><Input value={form.logo_gradient} onChange={(e) => setForm((p) => ({ ...p, logo_gradient: e.target.value }))} className="bg-background/50 border-border/50 font-mono text-xs" /></div>
              <div className="flex items-center gap-3 col-span-2"><Switch checked={form.active} onCheckedChange={(c) => setForm((p) => ({ ...p, active: c }))} /><Label>Produto ativo</Label></div>
              <div className="space-y-2 col-span-2"><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="bg-background/50 border-border/50" /></div>
              <div className="space-y-2 col-span-2"><Label>Conteúdos (JSON)</Label><Input value={form.featured_content} onChange={(e) => setForm((p) => ({ ...p, featured_content: e.target.value }))} placeholder='["Item 1","Item 2"]' className="bg-background/50 border-border/50 font-mono text-xs" /></div>
            </div>
            <div className="flex gap-3 pt-2"><Button onClick={handleSave} disabled={saving} className="flex-1 gradient-purple border-0 text-white"><Save className="mr-2 h-4 w-4" />{saving ? "Salvando..." : "Salvar"}</Button><Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }} className="border-border/50"><X className="mr-2 h-4 w-4" />Cancelar</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
