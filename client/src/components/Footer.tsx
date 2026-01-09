import { Link } from "wouter";
import { Phone, MapPin } from "lucide-react";
import logoImage from "@assets/EG_White_Logo_Blue_Star_1767936307419.png";

const serviceAreas = [
  { city: "Castro Valley", neighborhoods: ["Greenridge"] },
  { city: "Concord", neighborhoods: ["Parkside", "Rancho del Diablo"] },
  { city: "Foster City", neighborhoods: ["Bay Vista", "Marina Point", "Treasure Isle"] },
  { city: "Mountain View", neighborhoods: ["Cuesta Park", "Monta Loma", "Sylvan Park"] },
  { city: "Oakland", neighborhoods: ["Sequoyah Hills"] },
  { city: "Palo Alto", neighborhoods: ["Greenmeadow", "Midtown"] },
  { city: "San Jose", neighborhoods: ["Willow Glen", "Cambrian Park", "South San Jose"] },
  { city: "San Mateo", neighborhoods: ["San Mateo Highlands"] },
  { city: "San Rafael", neighborhoods: ["Terra Linda", "Lucas Valley"] },
  { city: "Sunnyvale", neighborhoods: ["Fairwood", "Cherry Chase"] },
  { city: "Walnut Creek", neighborhoods: ["Rancho San Miguel"] },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="Eichler Glass" 
                className="h-24 w-auto"
              />
            </div>
            <p className="text-background/70 text-sm max-w-sm mb-6">
              Professional glass cleaning specialists for Eichler and midcentury modern homes 
              throughout the Bay Area. Crystal clear results, guaranteed.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="h-4 w-4" />
                <span>(510) 859-3449</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="h-4 w-4" />
                <span>Serving the Bay Area</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Interior Glass Cleaning</li>
              <li>Exterior Glass Cleaning</li>
              <li>Screen Cleaning</li>
              <li>Track Detailing</li>
              <li>Solar Panel Cleaning</li>
              <li>Clerestory Windows</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-1 text-sm text-background/70">
              {serviceAreas.map((area) => (
                <li key={area.city}>
                  <span className="text-background/90">{area.city}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 flex flex-wrap gap-4 justify-between items-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Eichler Glass. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-background transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-background transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </Link>
            <Link href="/cancellation" className="hover:text-background transition-colors" data-testid="link-footer-cancellation">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
