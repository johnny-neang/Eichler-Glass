import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
import { useBookingWizard } from "@/components/BookingWizard";

interface PreservationPlan {
  id: string;
  name: string;
  discount: string;
  perCleaning: string;
  features: {
    name: string;
    included: boolean;
  }[];
  popular?: boolean;
}

const preservationPlans: PreservationPlan[] = [
  {
    id: "bi-annual",
    name: "Bi-Annual",
    discount: "$50 Off",
    perCleaning: "per cleaning",
    features: [
      { name: "Screen Cleaning", included: false },
      { name: "7-day Rain Guarantee", included: false },
      { name: "Hard Water Removal", included: false },
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    discount: "$100 Off",
    perCleaning: "per cleaning",
    features: [
      { name: "Screen Cleaning", included: true },
      { name: "7-day Rain Guarantee", included: true },
      { name: "Hard Water Removal", included: true },
    ],
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    discount: "$150 Off",
    perCleaning: "per cleaning",
    features: [
      { name: "Screen Cleaning", included: true },
      { name: "7-day Rain Guarantee", included: true },
      { name: "Hard Water Removal", included: true },
    ],
  },
];

interface PricingCardsProps {
  citySlug?: string;
}

export function PricingCards({ citySlug }: PricingCardsProps) {
  const { openWizard } = useBookingWizard();

  const handleSelectPlan = (planName: string) => {
    openWizard({ tier: planName, city: citySlug });
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
            Preservation Plans
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the frequency that keeps your glass sparkling year-round.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {preservationPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">{plan.discount}</span>
                  <p className="text-muted-foreground text-sm mt-1">{plan.perCleaning}</p>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <X className="h-5 w-5 shrink-0" style={{ color: '#e4572e' }} />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-4">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.name)}
                  data-testid={`button-select-${plan.id}`}
                >
                  Get Your Quote
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
