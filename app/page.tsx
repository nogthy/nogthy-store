import { getCategories, getProducts } from "@/lib/supabase";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { ProductSection } from "@/components/product-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div className="pt-16">
      <HeroSection />
      <BenefitsSection />
      <div id="produtos" className="scroll-mt-20">
        {categories.map((cat) => (<ProductSection key={cat.id} category={cat} products={products.filter((p) => p.category_id === cat.id)} />))}
      </div>
    </div>
  );
}
