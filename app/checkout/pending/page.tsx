import { Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPending() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center pt-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-600/20 text-yellow-400 mb-6"><Clock className="h-10 w-10" /></div>
      <h1 className="text-3xl font-bold">Pagamento Pendente</h1>
      <p className="mt-3 text-muted-foreground max-w-md">Seu pagamento está sendo processado. Você receberá a confirmação por e-mail assim que for aprovado.</p>
      <div className="mt-8"><Link href="/"><Button variant="outline" className="border-border/50">Voltar à Loja</Button></Link></div>
    </div>
  );
}
