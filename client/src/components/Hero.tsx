import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, Shield } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";
import heroImage from "@assets/generated_images/eichler_home_with_glass_windows.png";
import logoImage from "@assets/EG_White_Logo_Blue_Star_1767936307419.png";

interface HeroProps {
  cityName?: string;
  citySlug?: string;
}

export function Hero({ cityName, citySlug }: HeroProps) {
  const { openWizard } = useBookingWizard();
  
  const title = cityName
    ? `Premium Glass Cleaning in ${cityName}`
    : "Light Restored and Architecture Preserved for Midcentury Modern Homes";
  
  const subtitle = cityName
    ? `Expert glass cleaning services for Eichler and modern homes in ${cityName} and surrounding areas.`
    : "Professional glass cleaning services for Eichler homes throughout the Bay Area. Interior, exterior, and skylight specialists.";

  const handleBookClick = () => {
    openWizard({ city: citySlug });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Midcentury modern home with glass windows"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          {cityName && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-white text-sm font-medium">Serving {cityName}</span>
            </div>
          )}
          
          {!cityName ? (
            <div className="mb-6" data-testid="text-hero-title">
              <img 
                src={logoImage} 
                alt="Eichler Glass - The Original, Reborn"
                className="h-40 w-auto"
              />
            </div>
          ) : (
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" data-testid="text-hero-title">
              {title}
            </h1>
          )}
          
          <div className={!cityName ? "ml-12" : ""}>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                size="lg" 
                className="px-8 gap-2" 
                onClick={handleBookClick}
                data-testid="button-hero-book"
              >
                GET YOUR QUOTE
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm">Streak-free guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Fully insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">Bay Area local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
