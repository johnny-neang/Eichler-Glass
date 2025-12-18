import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "interior",
    name: "Interior",
    price: 250,
    description: "All interior glass surfaces cleaned to perfection",
    features: [
      "All interior windows",
      "Glass doors & panels",
      "Mirrors included",
      "Streak-free finish",
      "Same-day service available",
    ],
  },
  {
    id: "interior-exterior",
    name: "Interior + Exterior",
    price: 400,
    description: "Complete inside and outside glass cleaning",
    features: [
      "Everything in Interior",
      "All exterior windows",
      "Screen cleaning",
      "Track & sill cleaning",
      "Hard water stain removal",
    ],
    popular: true,
  },
  {
    id: "full-skylight",
    name: "Full + Skylight",
    price: 650,
    description: "Our comprehensive package including skylights",
    features: [
      "Everything in Interior + Exterior",
      "All skylights cleaned",
      "Solar tube cleaning",
      "High-reach glass panels",
      "Priority scheduling",
    ],
  },
];

interface PricingCardsProps {
  citySlug?: string;
}

export function PricingCards({ citySlug }: PricingCardsProps) {
  const bookingPath = citySlug ? `/${citySlug}/book` : "/book";

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the package that fits your home. $50 deposit secures your appointment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative flex flex-col ${
                tier.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              data-testid={`card-pricing-${tier.id}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-serif text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground ml-1">/ service</span>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-4">
                <Link href={`${bookingPath}?tier=${tier.id}`} className="w-full">
                  <Button
                    className="w-full rounded-full"
                    variant={tier.popular ? "default" : "outline"}
                    data-testid={`button-select-${tier.id}`}
                  >
                    Select Package
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-accent text-center" data-testid="panel-deposit-info">
          <p className="text-sm text-accent-foreground">
            <strong>$50 deposit</strong> required to secure your appointment. 
            We'll contact you to confirm the exact time and final price.
          </p>
        </div>
      </div>
    </section>
  );
}
