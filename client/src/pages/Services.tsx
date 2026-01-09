import { Navbar } from "@/components/Navbar";
import { ServiceShowcase } from "@/components/ServiceShowcase";
import { PricingCards } from "@/components/PricingCards";
import { CitySelector } from "@/components/CitySelector";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Phone } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";
import heroImage from "@assets/services-hero.jpg";

const benefits = [
  "Specialized in Eichler and midcentury modern homes",
  "Streak-free finish guaranteed",
  "Fully licensed and insured",
  "Eco-friendly cleaning solutions",
  "Flexible scheduling options",
  "Satisfaction guaranteed",
];

export default function Services() {
  const { openWizard } = useBookingWizard();

  const handleBookClick = () => {
    openWizard();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section 
          className="relative py-24 md:py-32 min-h-[60vh] flex items-center"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-services-page-title">
                Professional Glass Cleaning Services
              </h1>
              <p className="text-white/90 text-lg mb-8">
                We specialize in the unique glass configurations of Eichler and midcentury 
                modern homes. From floor-to-ceiling windows to skylights, we bring 
                crystal-clear results every time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={handleBookClick}
                  data-testid="button-services-book"
                >
                  Get Your Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="gap-2 text-white border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20" 
                  asChild
                  data-testid="button-services-call"
                >
                  <a href="tel:+15108593449">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <ServiceShowcase />

        <PricingCards />

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6" data-testid="text-why-choose-title">
                  Why Choose Eichler Glass?
                </h2>
                <p className="text-muted-foreground mb-8">
                  We understand that midcentury modern homes have unique glass cleaning 
                  requirements. Our team is trained specifically to handle the large 
                  glass panels, skylights, and architectural features common in Eichler homes.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-accent">
                <h3 className="font-semibold text-xl mb-4">Ready to get started?</h3>
                <p className="text-muted-foreground mb-6">
                  Book your cleaning today. We'll contact you 
                  within 24 hours to confirm your appointment details.
                </p>
                <Button 
                  className="w-full gap-2 mb-2" 
                  onClick={handleBookClick}
                  data-testid="button-cta-book"
                >
                  Book Your Cleaning
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  className="w-full gap-2" 
                  asChild
                  data-testid="button-cta-call"
                >
                  <a href="tel:+15108593449">
                    <Phone className="h-4 w-4" />
                    Or call us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <CitySelector />
        
        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready for Crystal Clear Glass?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get your free quote today and see why Bay Area homeowners trust Eichler Glass to maintain the continuity and seamless transition between your indoor and outdoor living.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 gap-2"
              onClick={handleBookClick}
              data-testid="button-services-footer-cta"
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
