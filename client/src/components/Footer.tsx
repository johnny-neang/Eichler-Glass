import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EG</span>
              </div>
              <span className="font-serif text-xl font-semibold">Eichler Glass</span>
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
                <Mail className="h-4 w-4" />
                <span>hello@eichlerglass.com</span>
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
              <li>
                <Link href="/pricing" className="hover:text-background transition-colors" data-testid="link-footer-exterior">
                  Exterior Cleaning
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-background transition-colors" data-testid="link-footer-interior-exterior">
                  Interior + Exterior
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-background transition-colors" data-testid="link-footer-full-skylight">
                  Full + Skylight
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-background transition-colors" data-testid="link-footer-pricing">
                  Add-ons & Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link href="/greenridge" className="hover:text-background transition-colors" data-testid="link-footer-greenridge">
                  Greenridge, Castro Valley
                </Link>
              </li>
              <li>
                <Link href="/sequoyah-hills" className="hover:text-background transition-colors" data-testid="link-footer-sequoyah-hills">
                  Sequoyah Hills, Oakland
                </Link>
              </li>
              <li>
                <Link href="/rancho-san-miguel" className="hover:text-background transition-colors" data-testid="link-footer-rancho-san-miguel">
                  Rancho San Miguel, Walnut Creek
                </Link>
              </li>
              <li>
                <Link href="/rancho-del-diablo" className="hover:text-background transition-colors" data-testid="link-footer-rancho-del-diablo">
                  Rancho del Diablo, Concord
                </Link>
              </li>
              <li>
                <Link href="/parkside" className="hover:text-background transition-colors" data-testid="link-footer-parkside">
                  Parkside, Concord
                </Link>
              </li>
              <li>
                <Link href="/bay-vista" className="hover:text-background transition-colors" data-testid="link-footer-bay-vista">
                  Bay Vista, Foster City
                </Link>
              </li>
              <li>
                <Link href="/treasure-isle" className="hover:text-background transition-colors" data-testid="link-footer-treasure-isle">
                  Treasure Isle, Foster City
                </Link>
              </li>
              <li>
                <Link href="/marina-point" className="hover:text-background transition-colors" data-testid="link-footer-marina-point">
                  Marina Point, Foster City
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-background transition-colors" data-testid="link-footer-contact">
                  Contact Us
                </Link>
              </li>
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
