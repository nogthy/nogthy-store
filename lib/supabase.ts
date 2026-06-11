import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = { id: string; name: string; slug: string; icon: string; sort_order: number; created_at: string; };
export type Product = { id: string; name: string; slug: string; category_id: string; price: number; original_price: number | null; duration: string; description: string; logo_color: string; logo_gradient: string; logo_icon: string; featured_content: string[]; stock: number; active: boolean; sort_order: number; created_at: string; updated_at: string; categories?: Category; };
export type Order = { id: string; product_id: string; customer_name: string; customer_email: string; customer_phone: string; status: 'pending' | 'paid' | 'delivered' | 'cancelled'; total: number; created_at: string; updated_at: string; products?: Product; };
export type Payment = { id: string; order_id: string; provider: string; provider_payment_id: string | null; status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'; qr_code: string | null; qr_code_base64: string | null; pix_copia_cola: string | null; expires_at: string | null; paid_at: string | null; created_at: string; updated_at: string; orders?: Order; };

export function formatPrice(price: number): string { return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
export function getDiscount(price: number, originalPrice: number | null): number | null { if (!originalPrice || originalPrice <= price) return null; return Math.round(((originalPrice - price) / originalPrice) * 100); }

export async function getCategories(): Promise<Category[]> { const { data, error } = await supabase.from('categories').select('*').order('sort_order'); if (error) throw error; return data; }
export async function getProducts(categorySlug?: string): Promise<Product[]> { let query = supabase.from('products').select('*, categories(*)').eq('active', true).order('sort_order'); if (categorySlug) { const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle(); if (cat) query = query.eq('category_id', cat.id); } const { data, error } = await query; if (error) throw error; return data; }
export async function getProductBySlug(slug: string): Promise<Product | null> { const { data, error } = await supabase.from('products').select('*, categories(*)').eq('slug', slug).eq('active', true).maybeSingle(); if (error) throw error; return data; }
export async function createOrder(order: { product_id: string; customer_name: string; customer_email: string; customer_phone: string; total: number }): Promise<Order> { const { data, error } = await supabase.from('orders').insert(order).select().single(); if (error) throw error; return data; }
export async function createPayment(payment: { order_id: string; provider: string; provider_payment_id?: string; status: string; qr_code?: string; qr_code_base64?: string; pix_copia_cola?: string; expires_at?: string }): Promise<Payment> { const { data, error } = await supabase.from('payments').insert(payment).select().single(); if (error) throw error; return data; }
export async function updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> { const { data, error } = await supabase.from('payments').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw error; return data; }
export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> { const { data, error } = await supabase.from('orders').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw error; return data; }
export async function getAllOrders(): Promise<Order[]> { const { data, error } = await supabase.from('orders').select('*, products(*)').order('created_at', { ascending: false }); if (error) throw error; return data; }
export async function getAllPayments(): Promise<Payment[]> { const { data, error } = await supabase.from('payments').select('*, orders(*)').order('created_at', { ascending: false }); if (error) throw error; return data; }
export async function getAllProductsAdmin(): Promise<Product[]> { const { data, error } = await supabase.from('products').select('*, categories(*)').order('sort_order'); if (error) throw error; return data; }
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> { const { data, error } = await supabase.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw error; return data; }
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'categories'>): Promise<Product> { const { data, error } = await supabase.from('products').insert(product).select().single(); if (error) throw error; return data; }
export async function deleteProduct(id: string): Promise<void> { const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; }
