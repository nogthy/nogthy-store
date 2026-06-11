import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nogthy Store - Assinaturas Premium com os Melhores Preços',
  description: 'Economize com suas assinaturas favoritas. Streamings, músicas e aplicativos premium por preços acessíveis. Pagamento via PIX.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
