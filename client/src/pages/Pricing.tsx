import { Navbar } from "@/components/Navbar";
import { PricingCards } from "@/components/PricingCards";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-pricing-page-title">
              Pricing & Packages
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparent pricing for professional glass cleaning. Choose the package 
              that fits your home's needs.
            </p>
          </div>
        </section>
        <PricingCards />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
