import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

interface City {
  slug: string;
  name: string;
  county: string;
  description: string;
}

const cities: City[] = [
  {
    slug: "greenridge",
    name: "Greenridge",
    county: "Castro Valley",
    description: "Serving the Greenridge neighborhood in Castro Valley",
  },
  {
    slug: "sequoyah-hills",
    name: "Sequoyah Hills",
    county: "Oakland",
    description: "Serving the Sequoyah Hills neighborhood in Oakland",
  },
  {
    slug: "rancho-san-miguel",
    name: "Rancho San Miguel",
    county: "Walnut Creek",
    description: "Serving the Rancho San Miguel neighborhood in Walnut Creek",
  },
  {
    slug: "rancho-del-diablo",
    name: "Rancho del Diablo",
    county: "Concord",
    description: "Serving the Rancho del Diablo neighborhood in Concord",
  },
  {
    slug: "parkside",
    name: "Parkside",
    county: "Concord",
    description: "Serving the Parkside neighborhood in Concord",
  },
];

export function CitySelector() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-cities-title">
            Service Areas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We proudly serve Eichler and midcentury modern homes throughout the Bay Area.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link key={city.slug} href={`/${city.slug}`}>
              <Card
                className="group hover-elevate cursor-pointer h-full transition-all duration-200"
                data-testid={`card-city-${city.slug}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{city.county}</p>
                      <p className="text-sm text-muted-foreground">{city.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Don't see your city? We may still serve your area.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="rounded-full" data-testid="button-contact-location">
              Contact Us About Your Location
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
