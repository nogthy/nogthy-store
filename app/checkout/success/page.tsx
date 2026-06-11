import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center pt-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-purple text-white mb-6"><CheckCircle className="h-10 w-10" /></div>
      <h1 className="text-3xl font-bold">Pagamento Confirmado!</h1>
      <p className="mt-3 text-muted-foreground max-w-md">Obrigado pela sua compra! Seu acesso será enviado por e-mail em breve. Caso tenha dúvidas, entre em contato pelo WhatsApp.</p>
      <div className="mt-8"><Link href="/"><Button variant="outline" className="border-border/50">Voltar à Loja</Button></Link></div>
    </div>
  );
}
