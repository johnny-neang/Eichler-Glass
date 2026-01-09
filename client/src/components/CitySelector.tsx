import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";
import bgImage from "@assets/service-areas-bg.jpg";

interface Neighborhood {
  slug: string;
  name: string;
  city: string;
}

interface CityGroup {
  city: string;
  citySlug: string;
  neighborhoods: Neighborhood[];
}

const cityGroups: CityGroup[] = [
  {
    city: "Castro Valley",
    citySlug: "castro-valley",
    neighborhoods: [
      { slug: "greenridge", name: "Greenridge", city: "Castro Valley" },
    ],
  },
  {
    city: "Concord",
    citySlug: "concord",
    neighborhoods: [
      { slug: "parkside", name: "Parkside", city: "Concord" },
      { slug: "rancho-del-diablo", name: "Rancho del Diablo", city: "Concord" },
    ],
  },
  {
    city: "Foster City",
    citySlug: "foster-city",
    neighborhoods: [
      { slug: "bay-vista", name: "Bay Vista", city: "Foster City" },
      { slug: "marina-point", name: "Marina Point", city: "Foster City" },
      { slug: "treasure-isle", name: "Treasure Isle", city: "Foster City" },
    ],
  },
  {
    city: "Mountain View",
    citySlug: "mountain-view",
    neighborhoods: [
      { slug: "cuesta-park", name: "Cuesta Park", city: "Mountain View" },
      { slug: "monta-loma", name: "Monta Loma", city: "Mountain View" },
      { slug: "sylvan-park", name: "Sylvan Park", city: "Mountain View" },
    ],
  },
  {
    city: "Oakland",
    citySlug: "oakland",
    neighborhoods: [
      { slug: "sequoyah-hills", name: "Sequoyah Hills", city: "Oakland" },
    ],
  },
  {
    city: "Palo Alto",
    citySlug: "palo-alto",
    neighborhoods: [
      { slug: "greenmeadow", name: "Greenmeadow", city: "Palo Alto" },
      { slug: "midtown", name: "Midtown", city: "Palo Alto" },
    ],
  },
  {
    city: "San Jose",
    citySlug: "san-jose",
    neighborhoods: [
      { slug: "willow-glen", name: "Willow Glen", city: "San Jose" },
      { slug: "cambrian-park", name: "Cambrian Park", city: "San Jose" },
      { slug: "south-san-jose", name: "South San Jose", city: "San Jose" },
    ],
  },
  {
    city: "San Mateo",
    citySlug: "san-mateo",
    neighborhoods: [
      { slug: "san-mateo-highlands", name: "San Mateo Highlands", city: "San Mateo" },
    ],
  },
  {
    city: "San Rafael",
    citySlug: "san-rafael",
    neighborhoods: [
      { slug: "terra-linda", name: "Terra Linda", city: "San Rafael" },
      { slug: "lucas-valley", name: "Lucas Valley", city: "San Rafael" },
    ],
  },
  {
    city: "Sunnyvale",
    citySlug: "sunnyvale",
    neighborhoods: [
      { slug: "fairwood", name: "Fairwood", city: "Sunnyvale" },
      { slug: "cherry-chase", name: "Cherry Chase", city: "Sunnyvale" },
    ],
  },
  {
    city: "Walnut Creek",
    citySlug: "walnut-creek",
    neighborhoods: [
      { slug: "rancho-san-miguel", name: "Rancho San Miguel", city: "Walnut Creek" },
    ],
  },
];

export function CitySelector() {
  const { openWizard } = useBookingWizard();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-background/40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-background/90 backdrop-blur-sm px-8 py-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-cities-title">
              Service Areas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We proudly serve Eichler and midcentury modern homes throughout the Bay Area.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cityGroups.map((group) => (
            <Card
              key={group.citySlug}
              className="group hover-elevate cursor-pointer h-full transition-all duration-200"
              data-testid={`card-city-${group.citySlug}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${group.citySlug}`}>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {group.city}
                      </h3>
                    </Link>
                    <ul className="space-y-1">
                      {group.neighborhoods.map((neighborhood) => (
                        <li key={neighborhood.slug}>
                          <Link 
                            href={`/${neighborhood.slug}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {neighborhood.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-background/90 backdrop-blur-sm px-8 py-6">
            <p className="text-muted-foreground mb-4">
              Don't see your neighborhood? We may still serve your area.
            </p>
            <Button 
              variant="outline" 
              onClick={() => openWizard()}
              data-testid="button-contact-location"
            >
              Get Your Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
