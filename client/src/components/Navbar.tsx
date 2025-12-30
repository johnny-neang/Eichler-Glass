import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalBooking } from "@/hooks/useCalBooking";
import logoImage from "@assets/EG_Black_Logo_Blue_Star_(no_tagline)_1767087626609.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/team", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const cities = [
  { slug: "bay-vista", name: "Bay Vista, Foster City" },
  { slug: "greenridge", name: "Greenridge, Castro Valley" },
  { slug: "marina-point", name: "Marina Point, Foster City" },
  { slug: "parkside", name: "Parkside, Concord" },
  { slug: "rancho-del-diablo", name: "Rancho del Diablo, Concord" },
  { slug: "rancho-san-miguel", name: "Rancho San Miguel, Walnut Creek" },
  { slug: "sequoyah-hills", name: "Sequoyah Hills, Oakland" },
  { slug: "treasure-isle", name: "Treasure Isle, Foster City" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { openBooking, isConfigured } = useCalBooking();

  const handleBookClick = () => {
    if (isConfigured) {
      openBooking();
    } else {
      window.location.href = "tel:+15108593449";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <img 
              src={logoImage} 
              alt="Eichler Glass" 
              className="h-10 w-auto dark:invert"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={
                    location === link.href
                      ? "text-primary border-b-2 border-primary"
                      : ""
                  }
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" data-testid="button-cities-dropdown">
                  Neighborhoods <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {cities.map((city) => (
                  <DropdownMenuItem key={city.slug} asChild>
                    <Link href={`/${city.slug}`} data-testid={`link-city-${city.slug}`}>
                      {city.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              className="px-6 gap-2 hidden sm:flex" 
              onClick={handleBookClick}
              data-testid="button-book-now"
            >
              {isConfigured ? "Book Now" : "Call Now"}
              {!isConfigured && <Phone className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground px-4 py-2">Neighborhoods</p>
              {cities.map((city) => (
                <Link key={city.slug} href={`/${city.slug}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8"
                    onClick={() => setMobileOpen(false)}
                    data-testid={`link-mobile-city-${city.slug}`}
                  >
                    {city.name}
                  </Button>
                </Link>
              ))}
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={() => {
                setMobileOpen(false);
                handleBookClick();
              }}
              data-testid="button-mobile-book"
            >
              {isConfigured ? "Book Now" : "Call Now"}
              {!isConfigured && <Phone className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
