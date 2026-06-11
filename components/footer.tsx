import Link from "next/link";
import { Mail, MessageCircle, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-purple"><span className="text-base font-bold text-white">N</span></div>
              <span className="text-lg font-bold">Nogthy<span className="text-purple-400"> Store</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Assinaturas Premium com os Melhores Preços. Streamings, músicas e aplicativos premium por preços acessíveis.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Categorias</h3>
            <ul className="space-y-2">
              <li><Link href="/#streaming" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Streaming</Link></li>
              <li><Link href="/#musica" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Música</Link></li>
              <li><Link href="/#aplicativos" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Aplicativos</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Suporte</h3>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Painel Admin</Link></li>
              <li><a href="https://wa.me/550000000000?text=Ol%C3%A1%2C%20vim%20pela%20Nogthy%20Store." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-400 transition-colors"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
              <li><span className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />contato@nogthy.com</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Segurança</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="h-4 w-4 text-purple-400" />Pagamento seguro via PIX</li>
              <li className="text-sm text-muted-foreground">Entrega instantânea</li>
              <li className="text-sm text-muted-foreground">Suporte 24/7</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Nogthy Store. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4"><span className="text-xs text-muted-foreground">Pagamento via PIX</span><span className="text-xs text-purple-400">Mercado Pago</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
