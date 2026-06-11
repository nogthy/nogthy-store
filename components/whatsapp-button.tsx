"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/550000000000?text=Ol%C3%A1%2C%20vim%20pela%20Nogthy%20Store." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600 hover:shadow-green-500/50 active:scale-95" aria-label="Contato via WhatsApp">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
