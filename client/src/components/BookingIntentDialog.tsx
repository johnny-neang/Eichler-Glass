import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface BookingIntentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCaptured: (leadId: string, data: { name: string; email: string; city?: string; packageTier?: string }) => void;
  preselectedPackage?: string;
  preselectedCity?: string;
}

const PACKAGES = [
  { value: "Exterior", label: "Exterior Only - $250" },
  { value: "Interior + Exterior", label: "Interior + Exterior - $450" },
  { value: "Full + Skylight", label: "Full + Skylight - $650" },
];

const CITIES = [
  { value: "greenridge", label: "Greenridge, Castro Valley" },
  { value: "sequoyah-hills", label: "Sequoyah Hills, Oakland" },
  { value: "rancho-san-miguel", label: "Rancho San Miguel, Walnut Creek" },
  { value: "rancho-del-diablo", label: "Rancho del Diablo, Concord" },
  { value: "parkside", label: "Parkside, Concord" },
  { value: "bay-vista", label: "Bay Vista, Foster City" },
  { value: "treasure-isle", label: "Treasure Isle, Foster City" },
  { value: "marina-point", label: "Marina Point, Foster City" },
];

export function BookingIntentDialog({
  open,
  onOpenChange,
  onLeadCaptured,
  preselectedPackage,
  preselectedCity,
}: BookingIntentDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [packageTier, setPackageTier] = useState("");

  useEffect(() => {
    setCity(preselectedCity || "");
    setPackageTier(preselectedPackage || "");
  }, [preselectedCity, preselectedPackage]);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; phone?: string; city?: string; packageTier?: string }) => {
      const response = await apiRequest("POST", "/api/leads/public", data);
      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedName = name;
    const submittedEmail = email;
    
    const submittedCity = city;
    const submittedPackage = packageTier;
    
    try {
      const result = await mutation.mutateAsync({
        name: submittedName,
        email: submittedEmail,
        phone: phone || undefined,
        city: submittedCity || undefined,
        packageTier: submittedPackage || undefined,
      });
      
      setName("");
      setEmail("");
      setPhone("");
      onOpenChange(false);
      
      onLeadCaptured(result.leadId, { 
        name: submittedName, 
        email: submittedEmail,
        city: submittedCity || undefined,
        packageTier: submittedPackage || undefined,
      });
    } catch (error) {
      // Error will be handled by mutation.isError
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Cleaning</DialogTitle>
          <DialogDescription>
            Enter your details to schedule your glass cleaning appointment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-name">Name</Label>
            <Input
              id="booking-name"
              data-testid="input-booking-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-email">Email</Label>
            <Input
              id="booking-email"
              data-testid="input-booking-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mutation.isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-phone">Phone (optional)</Label>
            <Input
              id="booking-phone"
              data-testid="input-booking-phone"
              type="tel"
              placeholder="(510) 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-city">Neighborhood</Label>
            <Select value={city} onValueChange={setCity} disabled={mutation.isPending}>
              <SelectTrigger id="booking-city" data-testid="select-booking-city">
                <SelectValue placeholder="Select your neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-package">Service Package</Label>
            <Select value={packageTier} onValueChange={setPackageTier} disabled={mutation.isPending}>
              <SelectTrigger id="booking-package" data-testid="select-booking-package">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {PACKAGES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {mutation.isError && (
            <p className="text-sm text-destructive" data-testid="text-booking-error">
              {(mutation.error as Error)?.message || "Something went wrong. Please try again."}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
            data-testid="button-booking-submit"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Schedule"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
