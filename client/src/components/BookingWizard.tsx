import { useState, createContext, useContext, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_AREAS = [
  "Castro Valley",
  "Concord",
  "Foster City",
  "Mountain View",
  "Oakland",
  "Palo Alto",
  "San Jose",
  "San Mateo",
  "San Rafael",
  "Sunnyvale",
  "Walnut Creek",
];

const SLUG_TO_CITY: Record<string, string> = {
  "castro-valley": "Castro Valley",
  "greenridge": "Castro Valley",
  "concord": "Concord",
  "parkside": "Concord",
  "rancho-del-diablo": "Concord",
  "foster-city": "Foster City",
  "bay-vista": "Foster City",
  "marina-point": "Foster City",
  "treasure-isle": "Foster City",
  "mountain-view": "Mountain View",
  "cuesta-park": "Mountain View",
  "monta-loma": "Mountain View",
  "sylvan-park": "Mountain View",
  "oakland": "Oakland",
  "sequoyah-hills": "Oakland",
  "palo-alto": "Palo Alto",
  "greenmeadow": "Palo Alto",
  "midtown": "Palo Alto",
  "san-jose": "San Jose",
  "willow-glen": "San Jose",
  "cambrian-park": "San Jose",
  "south-san-jose": "San Jose",
  "san-mateo": "San Mateo",
  "san-mateo-highlands": "San Mateo",
  "san-rafael": "San Rafael",
  "terra-linda": "San Rafael",
  "lucas-valley": "San Rafael",
  "sunnyvale": "Sunnyvale",
  "fairwood": "Sunnyvale",
  "cherry-chase": "Sunnyvale",
  "walnut-creek": "Walnut Creek",
  "rancho-san-miguel": "Walnut Creek",
};

const PROPERTY_TYPES = ["Residential 1-story", "Residential 2-story"];

const SERVICES = [
  "Exterior Window Cleaning",
  "Interior Window Cleaning",
  "Screen Cleaning",
  "Skylight Cleaning",
  "Solar Panel Cleaning",
];

const PRESERVATION_PLANS = [
  {
    name: "One-Time",
    discount: null,
    features: ["No free screen cleaning", "No hard water removal", "No rain guarantee"],
  },
  {
    name: "Bi-Annual",
    discount: "$50 Off",
    features: ["Free screen cleaning", "Free hard water removal", "7-day rain guarantee"],
  },
  {
    name: "Quarterly",
    discount: "$100 Off",
    features: ["Free screen cleaning", "Free hard water removal", "7-day rain guarantee"],
    popular: true,
  },
  {
    name: "Monthly",
    discount: "$150 Off",
    features: ["Free screen cleaning", "Free hard water removal", "7-day rain guarantee"],
  },
];

const REFERRAL_SOURCES = ["Google", "Yelp", "Instagram", "Referral", "Other"];

const formSchema = z.object({
  location: z.string().min(1, "Please select a location"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  referralSource: z.string().optional(),
  promoCode: z.string().optional(),
  propertyType: z.string().min(1, "Please select a property type"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  frequency: z.string().min(1, "Please select a frequency"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  pageUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WizardContextType {
  isOpen: boolean;
  openWizard: (options?: { city?: string; tier?: string }) => void;
  closeWizard: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function useBookingWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useBookingWizard must be used within BookingWizardProvider");
  }
  return context;
}

export function BookingWizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<{ city?: string; tier?: string }>({});

  const openWizard = useCallback((options?: { city?: string; tier?: string }) => {
    setInitialData(options || {});
    setIsOpen(true);
  }, []);

  const closeWizard = useCallback(() => {
    setIsOpen(false);
    setInitialData({});
  }, []);

  return (
    <WizardContext.Provider value={{ isOpen, openWizard, closeWizard }}>
      {children}
      {isOpen && <WizardModal initialData={initialData} onClose={closeWizard} />}
    </WizardContext.Provider>
  );
}

function WizardModal({ 
  initialData, 
  onClose 
}: { 
  initialData: { city?: string; tier?: string };
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const initialLocation = initialData.city ? (SLUG_TO_CITY[initialData.city] || "") : "";
  
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: initialLocation,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      referralSource: "",
      promoCode: "",
      propertyType: "",
      services: [],
      frequency: initialData.tier || "",
      street: "",
      city: "",
      state: "CA",
      zip: "",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const steps = [
    { title: "Location", validate: ["location"] },
    { title: "Contact", validate: ["firstName", "lastName", "email", "phone"] },
    { title: "Property", validate: ["propertyType"] },
    { title: "Services", validate: ["services"] },
    { title: "Frequency", validate: ["frequency"] },
    { title: "Address", validate: ["street", "city", "state", "zip"] },
  ];

  const currentStepFields = steps[step]?.validate || [];
  const { watch, trigger, handleSubmit, setValue, formState: { errors } } = methods;
  const formValues = watch();

  const isStepValid = () => {
    for (const field of currentStepFields) {
      const value = formValues[field as keyof FormData];
      if (field === "services") {
        if (!Array.isArray(value) || value.length === 0) return false;
      } else if (!value || (typeof value === "string" && value.trim() === "")) {
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    const valid = await trigger(currentStepFields as Array<keyof FormData>);
    if (valid && step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    if (!submitted && (formValues.firstName || formValues.email)) {
      if (confirm("Are you sure? Your info will be lost.")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background w-full max-w-lg mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 mx-auto mb-6 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Thanks for reaching out!</h2>
          <p className="text-muted-foreground mb-8">
            We'll call you shortly to discuss your glass cleaning needs.
          </p>
          <Button onClick={onClose} data-testid="button-close-success">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                data-testid="button-wizard-back"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <span className="font-medium">
              Step {step + 1} of {steps.length}: {steps[step].title}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            data-testid="button-wizard-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-1 p-4 border-b">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6" noValidate>
            {step === 0 && (
              <StepLocation 
                value={formValues.location} 
                onChange={(v) => setValue("location", v, { shouldValidate: true })} 
              />
            )}
            {step === 1 && <StepContact methods={methods} errors={errors} />}
            {step === 2 && (
              <StepProperty 
                value={formValues.propertyType} 
                onChange={(v) => setValue("propertyType", v, { shouldValidate: true })} 
              />
            )}
            {step === 3 && (
              <StepServices 
                value={formValues.services} 
                onChange={(v) => setValue("services", v, { shouldValidate: true })} 
              />
            )}
            {step === 4 && (
              <StepFrequency 
                value={formValues.frequency} 
                onChange={(v) => setValue("frequency", v, { shouldValidate: true })} 
              />
            )}
            {step === 5 && <StepAddress methods={methods} errors={errors} />}

            <div className="mt-8 flex justify-end gap-3">
              {step < steps.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  data-testid="button-wizard-next"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={mutation.isPending || !isStepValid()}
                  data-testid="button-wizard-submit"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Get Your Quote"
                  )}
                </Button>
              )}
            </div>

            {mutation.isError && (
              <p className="mt-4 text-destructive text-sm">
                {mutation.error?.message || "Something went wrong. Please try again."}
              </p>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

function StepLocation({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Your Location</h2>
      <p className="text-muted-foreground mb-6">Choose your neighborhood from the list below.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SERVICE_AREAS.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => onChange(area)}
            className={`p-4 border text-left hover-elevate ${
              value === area ? "border-primary bg-primary/5" : "border-border"
            }`}
            data-testid={`button-location-${area.toLowerCase().replace(/\s/g, "-")}`}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepContact({ 
  methods, 
  errors 
}: { 
  methods: ReturnType<typeof useForm<FormData>>; 
  errors: typeof methods.formState.errors;
}) {
  const { register, setValue, watch } = methods;
  const referralSource = watch("referralSource");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Let's get to know you!</h2>
      <p className="text-muted-foreground mb-6">We'll use this to contact you about your quote.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input 
            id="firstName" 
            autoComplete="given-name"
            {...register("firstName")} 
            data-testid="input-first-name"
          />
          {errors.firstName && (
            <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input 
            id="lastName" 
            autoComplete="family-name"
            {...register("lastName")} 
            data-testid="input-last-name"
          />
          {errors.lastName && (
            <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          type="email" 
          autoComplete="email"
          {...register("email")} 
          data-testid="input-email"
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="phone">Phone *</Label>
        <Input 
          id="phone" 
          type="text"
          inputMode="tel"
          autoComplete="tel"
          {...register("phone")} 
          data-testid="input-phone"
        />
        {errors.phone && (
          <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="referralSource">How did you hear about us?</Label>
        <Select value={referralSource} onValueChange={(v) => setValue("referralSource", v)}>
          <SelectTrigger data-testid="select-referral-source">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {REFERRAL_SOURCES.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="promoCode">Promo Code (optional)</Label>
        <Input 
          id="promoCode" 
          {...register("promoCode")} 
          data-testid="input-promo-code"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        By submitting this form, you agree to receive SMS and email communications about your service.
      </p>
    </div>
  );
}

function StepProperty({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">What type of property?</h2>
      <p className="text-muted-foreground mb-6">Select your property type.</p>
      <div className="grid grid-cols-2 gap-4">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`p-6 border text-center hover-elevate ${
              value === type ? "border-primary bg-primary/5" : "border-border"
            }`}
            data-testid={`button-property-${type.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="text-lg font-medium">{type}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepServices({ 
  value, 
  onChange 
}: { 
  value: string[]; 
  onChange: (v: string[]) => void;
}) {
  const toggle = (service: string) => {
    if (value.includes(service)) {
      onChange(value.filter((s) => s !== service));
    } else {
      onChange([...value, service]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">What services do you need?</h2>
      <p className="text-muted-foreground mb-6">Select all that apply.</p>
      <div className="grid gap-3">
        {SERVICES.map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => toggle(service)}
            className={`p-4 border text-left flex items-center gap-3 hover-elevate ${
              value.includes(service) ? "border-primary bg-primary/5" : "border-border"
            }`}
            data-testid={`button-service-${service.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className={`w-5 h-5 border flex items-center justify-center ${
              value.includes(service) ? "bg-primary border-primary" : "border-border"
            }`}>
              {value.includes(service) && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            {service}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepFrequency({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Choose Your Preservation Plan</h2>
      <p className="text-muted-foreground mb-6">More frequent cleanings mean bigger savings.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRESERVATION_PLANS.map((plan) => (
          <button
            key={plan.name}
            type="button"
            onClick={() => onChange(plan.name)}
            className={`p-4 border text-left hover-elevate flex flex-col h-full relative ${
              value === plan.name ? "border-primary bg-primary/5" : "border-border"
            } ${'popular' in plan && plan.popular ? "ring-2 ring-primary" : ""}`}
            data-testid={`button-frequency-${plan.name.toLowerCase().replace(/\s/g, "-")}`}
          >
            {'popular' in plan && plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 font-medium">
                MOST POPULAR
              </div>
            )}
            <div className="text-center mb-3">
              <span className="font-semibold text-base">{plan.name}</span>
            </div>
            <div className="text-center mb-3 min-h-[28px]">
              {plan.discount && (
                <span className="text-primary font-bold text-lg">{plan.discount}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx}>{feature}</div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAddress({ 
  methods, 
  errors 
}: { 
  methods: ReturnType<typeof useForm<FormData>>; 
  errors: typeof methods.formState.errors;
}) {
  const { register, setValue, watch } = methods;
  const state = watch("state");

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">You're almost there!</h2>
      <p className="text-muted-foreground mb-6">Enter your service address.</p>
      
      <div className="mb-4">
        <Label htmlFor="street">Street Address *</Label>
        <Input 
          id="street" 
          autoComplete="street-address"
          {...register("street")} 
          data-testid="input-street"
        />
        {errors.street && (
          <p className="text-destructive text-sm mt-1">{errors.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city" 
            autoComplete="address-level2"
            {...register("city")} 
            data-testid="input-city"
          />
          {errors.city && (
            <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={state} onValueChange={(v) => setValue("state", v, { shouldValidate: true })}>
            <SelectTrigger data-testid="select-state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-destructive text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="zip">ZIP Code *</Label>
        <Input 
          id="zip" 
          inputMode="numeric"
          autoComplete="postal-code"
          {...register("zip")} 
          data-testid="input-zip"
        />
        {errors.zip && (
          <p className="text-destructive text-sm mt-1">{errors.zip.message}</p>
        )}
      </div>
    </div>
  );
}
