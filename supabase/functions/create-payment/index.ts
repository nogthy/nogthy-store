import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey" };
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const { productId, productName, price, customerName, customerEmail, customerPhone } = await req.json();
    if (!productId || !productName || !price || !customerName || !customerEmail) return new Response(JSON.stringify({ error: "Campos obrigatórios ausentes" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, { method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, Prefer: "return=representation" }, body: JSON.stringify({ product_id: productId, customer_name: customerName, customer_email: customerEmail, customer_phone: customerPhone || "", status: "pending", total: price }) });
    if (!orderRes.ok) throw new Error(`Erro ao criar pedido: ${await orderRes.text()}`);
    const orders = await orderRes.json();
    const orderId = orders[0].id;

    if (MERCADO_PAGO_ACCESS_TOKEN) {
      const mpRes = await fetch("https://api.mercadopago.com/v1/payments", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`, "X-Idempotency-Key": orderId }, body: JSON.stringify({ transaction_amount: Number(price), description: `Nogthy Store - ${productName}`, payment_method_id: "pix", payer: { email: customerEmail, first_name: customerName } }) });
      if (!mpRes.ok) {
        const checkoutRes = await fetch("https://api.mercadopago.com/checkout/preferences", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}` }, body: JSON.stringify({ items: [{ title: `Nogthy Store - ${productName}`, unit_price: Number(price), quantity: 1, currency_id: "BRL" }], payer: { name: customerName, email: customerEmail }, back_urls: { success: `${new URL(req.url).origin}/checkout/success`, failure: `${new URL(req.url).origin}/checkout/failure`, pending: `${new URL(req.url).origin}/checkout/pending` }, auto_return: "approved", notification_url: `${SUPABASE_URL}/functions/v1/webhook-mercadopago` }) });
        if (checkoutRes.ok) { const checkout = await checkoutRes.json(); return new Response(JSON.stringify({ orderId, checkoutUrl: checkout.init_point }), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
        throw new Error("Erro ao criar pagamento no Mercado Pago");
      }
      const mpData = await mpRes.json();
      const pixData = mpData.point_of_interaction?.transaction_data;
      await fetch(`${SUPABASE_URL}/rest/v1/payments`, { method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, Prefer: "return=representation" }, body: JSON.stringify({ order_id: orderId, provider: "mercado_pago", provider_payment_id: String(mpData.id), status: "pending", qr_code: pixData?.qr_code || null, qr_code_base64: pixData?.qr_code_base64 || null, pix_copia_cola: pixData?.qr_code || null, expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() }) });
      return new Response(JSON.stringify({ orderId, qrCode: pixData?.qr_code || null, qrCodeBase64: pixData?.qr_code_base64 || null, pixCopiaECola: pixData?.qr_code || null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ orderId, message: "Mercado Pago não configurado." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Erro interno" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
