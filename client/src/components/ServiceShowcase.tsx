import { Card, CardContent } from "@/components/ui/card";
import { Layers, Sun, Square } from "lucide-react";
import interiorImage from "@assets/generated_images/clean_glass_windows_interior.png";
import skylightImage from "@assets/generated_images/skylight_natural_light.png";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: typeof Layers;
  image: string;
}

const services: Service[] = [
  {
    id: "interior",
    title: "Interior Glass Cleaning",
    description: "Pristine interior windows, glass doors, and mirrors. Our meticulous process removes fingerprints, dust, and buildup for crystal-clear views.",
    icon: Square,
    image: interiorImage,
  },
  {
    id: "exterior",
    title: "Exterior Glass Cleaning",
    description: "Professional exterior cleaning tackles weather residue, hard water stains, and environmental deposits. Safe techniques for all heights.",
    icon: Layers,
    image: interiorImage,
  },
  {
    id: "skylight",
    title: "Skylight Specialists",
    description: "Expert skylight cleaning brings natural light flooding back into your home. We handle all types of skylights and solar tubes.",
    icon: Sun,
    image: skylightImage,
  },
];

export function ServiceShowcase() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Specialized glass cleaning for the unique architecture of Eichler and midcentury modern homes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden group" data-testid={`card-service-${service.id}`}>
              <div className="aspect-video overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
