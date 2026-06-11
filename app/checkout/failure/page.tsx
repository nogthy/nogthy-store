import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutFailure() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center pt-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600/20 text-red-400 mb-6"><XCircle className="h-10 w-10" /></div>
      <h1 className="text-3xl font-bold">Pagamento Recusado</h1>
      <p className="mt-3 text-muted-foreground max-w-md">Não foi possível processar seu pagamento. Verifique seus dados e tente novamente.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/"><Button variant="outline" className="border-border/50">Voltar à Loja</Button></Link>
        <a href="https://wa.me/550000000000?text=Ol%C3%A1%2C%20vim%20pela%20Nogthy%20Store."><Button className="gradient-purple border-0 text-white">Falar no WhatsApp</Button></a>
      </div>
    </div>
  );
}
