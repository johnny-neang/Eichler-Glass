import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceShowcase } from "@/components/ServiceShowcase";
import { PricingCards } from "@/components/PricingCards";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const cityData: Record<string, { name: string; county: string }> = {
  "castro-valley": { name: "Castro Valley", county: "Alameda County" },
  "concord": { name: "Concord", county: "Contra Costa County" },
  "walnut-creek": { name: "Walnut Creek", county: "Contra Costa County" },
};

export default function CityLanding() {
  const params = useParams<{ city: string }>();
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
      </main>
      <Footer />
    </div>
  );
}
