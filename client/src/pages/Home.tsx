import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceShowcase } from "@/components/ServiceShowcase";
import { PricingCards } from "@/components/PricingCards";
import { CitySelector } from "@/components/CitySelector";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";

export default function Home() {
  const { openWizard } = useBookingWizard();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServiceShowcase />
        <PricingCards />
        <CitySelector />
        <Testimonials />
        <FAQ />
        
        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready for Crystal Clear Glass?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get your free quote today and see why Bay Area homeowners trust Eichler Glass for their midcentury modern homes.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 gap-2"
              onClick={() => openWizard()}
              data-testid="button-footer-cta"
            >
              GET YOUR QUOTE
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
