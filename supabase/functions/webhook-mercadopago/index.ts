import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey" };
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const body = await req.json();
    const paymentId = body.data?.id;
    if (!paymentId) return new Response(JSON.stringify({ message: "No payment ID" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!MERCADO_PAGO_ACCESS_TOKEN) return new Response(JSON.stringify({ message: "MP not configured" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}` } });
    if (!mpRes.ok) throw new Error(`Failed to fetch payment ${paymentId}`);
    const mpPayment = await mpRes.json();
    const status = mpPayment.status;

    const paymentRes = await fetch(`${SUPABASE_URL}/rest/v1/payments?provider_payment_id=eq.${paymentId}&select=*,orders(*)`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } });
    if (!paymentRes.ok) throw new Error("Failed to find payment record");
    const payments = await paymentRes.json();
    if (payments.length === 0) return new Response(JSON.stringify({ message: "Payment not found" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const payment = payments[0];
    const orderId = payment.order_id;
    const updateData: Record<string, string> = { status, updated_at: new Date().toISOString() };
    if (status === "approved") updateData.paid_at = new Date().toISOString();

    await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${payment.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }, body: JSON.stringify(updateData) });
    const orderStatus = status === "approved" ? "paid" : status === "rejected" || status === "cancelled" ? "cancelled" : "pending";
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json", apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }, body: JSON.stringify({ status: orderStatus, updated_at: new Date().toISOString() }) });

    return new Response(JSON.stringify({ message: "Webhook processed", status }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
