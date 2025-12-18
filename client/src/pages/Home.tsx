import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceShowcase } from "@/components/ServiceShowcase";
import { PricingCards } from "@/components/PricingCards";
import { CitySelector } from "@/components/CitySelector";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
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
      </main>
      <Footer />
    </div>
  );
}
