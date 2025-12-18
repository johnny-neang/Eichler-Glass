import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CreditCard, Check, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  cityName?: string;
  preselectedTier?: string;
}

const tiers = [
  { id: "exterior", name: "Exterior", price: 250 },
  { id: "interior-exterior", name: "Interior + Exterior", price: 450 },
  { id: "full-skylight", name: "Full + Skylight", price: 650 },
];

interface AddOn {
  id: string;
  name: string;
  price: string;
  description: string;
  note: string;
}

const addOns: AddOn[] = [
  {
    id: "screen-cleaning",
    name: "Screen Cleaning",
    price: "$8 per screen",
    description: "Removal, light wash only, reinstall",
    note: "No repairs or patching",
  },
  {
    id: "skylights",
    name: "Skylights",
    price: "$15-25 per skylight",
    description: "Interior + exterior if accessible",
    note: "Price varies by accessibility",
  },
  {
    id: "moving-furniture",
    name: "Moving Furniture / Obstructions",
    price: "$50-150 flat fee",
    description: "Heavy planters, sofas, dining tables, lamps",
    note: "Not responsible for damage",
  },
  {
    id: "two-story",
    name: "Two-Story Home",
    price: "$250-300 flat premium",
    description: "Required for split-level or additions",
    note: "Price varies by complexity",
  },
];

export function BookingForm({ cityName, preselectedTier }: BookingFormProps) {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState(preselectedTier || "interior-exterior");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [step, setStep] = useState<"details" | "confirm">("details");

  const selectedPackage = tiers.find((t) => t.id === selectedTier);
  const selectedAddOnDetails = addOns.filter((a) => selectedAddOns.includes(a.id));

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "details") {
      setStep("confirm");
    } else {
      toast({
        title: "Booking Submitted!",
        description: "We'll contact you shortly to confirm your appointment.",
      });
      console.log("Booking submitted:", { ...formData, tier: selectedTier, addOns: selectedAddOns, city: cityName });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-booking-title">
            Book Your Cleaning
          </h2>
          <p className="text-muted-foreground">
            {cityName ? `Professional glass cleaning in ${cityName}` : "Select your package and schedule your appointment"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className={`flex items-center gap-2 ${step === "details" ? "text-primary font-medium" : ""}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  1
                </div>
                Details
              </div>
              <div className="w-8 h-px bg-border" />
              <div className={`flex items-center gap-2 ${step === "confirm" ? "text-primary font-medium" : ""}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "confirm" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  2
                </div>
                Confirm
              </div>
            </div>
            <CardTitle>{step === "details" ? "Your Information" : "Confirm Booking"}</CardTitle>
            <CardDescription>
              {step === "details" 
                ? "Fill in your details and select a package" 
                : "Review your booking and pay $50 deposit"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === "details" ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          data-testid="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(510) 555-0123"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Eichler Way, Castro Valley, CA"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        data-testid="input-address"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Select Package</Label>
                    <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="space-y-2">
                      {tiers.map((tier) => (
                        <label
                          key={tier.id}
                          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedTier === tier.id
                              ? "border-primary bg-accent"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`radio-tier-${tier.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={tier.id} id={tier.id} />
                            <span className="font-medium">{tier.name}</span>
                          </div>
                          <span className="font-semibold">${tier.price}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add-Ons (Optional)
                    </Label>
                    <div className="space-y-2">
                      {addOns.map((addOn) => (
                        <label
                          key={addOn.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddOns.includes(addOn.id)
                              ? "border-primary bg-accent"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`checkbox-addon-${addOn.id}`}
                        >
                          <Checkbox
                            checked={selectedAddOns.includes(addOn.id)}
                            onCheckedChange={() => toggleAddOn(addOn.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-medium">{addOn.name}</span>
                              <span className="font-semibold text-sm">{addOn.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                            <p className="text-xs text-muted-foreground mt-1 italic">{addOn.note}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special access instructions or areas of concern..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      data-testid="textarea-notes"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-accent space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-medium">{selectedPackage?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package Price</span>
                      <span className="font-medium">${selectedPackage?.price}</span>
                    </div>
                    {selectedAddOnDetails.length > 0 && (
                      <div className="border-t border-border pt-3 space-y-2">
                        <span className="text-muted-foreground text-sm">Add-Ons:</span>
                        {selectedAddOnDetails.map((addOn) => (
                          <div key={addOn.id} className="flex justify-between text-sm">
                            <span>{addOn.name}</span>
                            <span className="font-medium">{addOn.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="text-muted-foreground">Deposit Due Today</span>
                      <span className="font-bold text-primary">$50</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{formData.address}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CreditCard className="h-4 w-4" />
                      Payment via Stripe
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You'll be redirected to our secure payment page to complete the $50 deposit.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 text-sm">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">What happens next?</p>
                      <p className="text-muted-foreground mt-1">
                        After your deposit, we'll contact you within 24 hours to confirm the exact date, 
                        time, and estimated price for your service.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {step === "confirm" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("details")}
                    data-testid="button-back"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1 rounded-full" data-testid="button-submit-booking">
                  {step === "details" ? "Continue" : "Pay $50 Deposit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
