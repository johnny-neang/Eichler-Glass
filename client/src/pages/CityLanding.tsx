import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceShowcase } from "@/components/ServiceShowcase";
import { PricingCards } from "@/components/PricingCards";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";

const cityData: Record<string, { name: string; county: string }> = {
  "greenridge": { name: "Greenridge", county: "Castro Valley" },
  "castro-valley": { name: "Castro Valley", county: "Alameda County" },
  "sequoyah-hills": { name: "Sequoyah Hills", county: "Oakland" },
  "oakland": { name: "Oakland", county: "Alameda County" },
  "rancho-san-miguel": { name: "Rancho San Miguel", county: "Walnut Creek" },
  "walnut-creek": { name: "Walnut Creek", county: "Contra Costa County" },
  "rancho-del-diablo": { name: "Rancho del Diablo", county: "Concord" },
  "parkside": { name: "Parkside", county: "Concord" },
  "concord": { name: "Concord", county: "Contra Costa County" },
  "bay-vista": { name: "Bay Vista", county: "Foster City" },
  "treasure-isle": { name: "Treasure Isle", county: "Foster City" },
  "marina-point": { name: "Marina Point", county: "Foster City" },
  "foster-city": { name: "Foster City", county: "San Mateo County" },
  "cuesta-park": { name: "Cuesta Park", county: "Mountain View" },
  "monta-loma": { name: "Monta Loma", county: "Mountain View" },
  "sylvan-park": { name: "Sylvan Park", county: "Mountain View" },
  "mountain-view": { name: "Mountain View", county: "Santa Clara County" },
  "greenmeadow": { name: "Greenmeadow", county: "Palo Alto" },
  "midtown": { name: "Midtown", county: "Palo Alto" },
  "palo-alto": { name: "Palo Alto", county: "Santa Clara County" },
  "willow-glen": { name: "Willow Glen", county: "San Jose" },
  "cambrian-park": { name: "Cambrian Park", county: "San Jose" },
  "south-san-jose": { name: "South San Jose", county: "San Jose" },
  "san-jose": { name: "San Jose", county: "Santa Clara County" },
  "san-mateo-highlands": { name: "San Mateo Highlands", county: "San Mateo" },
  "san-mateo": { name: "San Mateo", county: "San Mateo County" },
  "terra-linda": { name: "Terra Linda", county: "San Rafael" },
  "lucas-valley": { name: "Lucas Valley", county: "San Rafael" },
  "san-rafael": { name: "San Rafael", county: "Marin County" },
  "fairwood": { name: "Fairwood", county: "Sunnyvale" },
  "cherry-chase": { name: "Cherry Chase", county: "Sunnyvale" },
  "sunnyvale": { name: "Sunnyvale", county: "Santa Clara County" },
};

export default function CityLanding() {
  const params = useParams<{ city: string }>();
  const { openWizard } = useBookingWizard();
  const city = cityData[params.city || ""] || { name: "Bay Area", county: "" };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero cityName={city.name} citySlug={params.city} />
        <ServiceShowcase />
        <PricingCards citySlug={params.city} />
        <Testimonials />
        <FAQ cityName={city.name} />
        
        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready for Crystal Clear Glass?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get your free quote today and see why {city.name} homeowners trust Eichler Glass for their midcentury modern homes.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 gap-2"
              onClick={() => openWizard({ city: params.city })}
              data-testid="button-city-footer-cta"
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
