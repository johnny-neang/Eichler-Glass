import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import EG_4_point_atomic_star from "@assets/EG 4 point atomic star.png";

const navLinks = [
  { href: "/team", label: "About Us" },
  { href: "/services", label: "Services" },
];

const neighborhoodGroups = [
  { 
    city: "Castro Valley", 
    citySlug: "castro-valley",
    neighborhoods: [{ slug: "greenridge", name: "Greenridge" }] 
  },
  { 
    city: "Concord", 
    citySlug: "concord",
    neighborhoods: [
      { slug: "parkside", name: "Parkside" },
      { slug: "rancho-del-diablo", name: "Rancho del Diablo" }
    ] 
  },
  { 
    city: "Foster City", 
    citySlug: "foster-city",
    neighborhoods: [
      { slug: "bay-vista", name: "Bay Vista" },
      { slug: "marina-point", name: "Marina Point" },
      { slug: "treasure-isle", name: "Treasure Isle" }
    ] 
  },
  { 
    city: "Mountain View", 
    citySlug: "mountain-view",
    neighborhoods: [
      { slug: "cuesta-park", name: "Cuesta Park" },
      { slug: "monta-loma", name: "Monta Loma" },
      { slug: "sylvan-park", name: "Sylvan Park" }
    ] 
  },
  { 
    city: "Oakland", 
    citySlug: "oakland",
    neighborhoods: [{ slug: "sequoyah-hills", name: "Sequoyah Hills" }] 
  },
  { 
    city: "Palo Alto", 
    citySlug: "palo-alto",
    neighborhoods: [
      { slug: "greenmeadow", name: "Greenmeadow" },
      { slug: "midtown", name: "Midtown" }
    ] 
  },
  { 
    city: "San Jose", 
    citySlug: "san-jose",
    neighborhoods: [
      { slug: "willow-glen", name: "Willow Glen" },
      { slug: "cambrian-park", name: "Cambrian Park" },
      { slug: "south-san-jose", name: "South San Jose" }
    ] 
  },
  { 
    city: "San Mateo", 
    citySlug: "san-mateo",
    neighborhoods: [{ slug: "san-mateo-highlands", name: "San Mateo Highlands" }] 
  },
  { 
    city: "San Rafael", 
    citySlug: "san-rafael",
    neighborhoods: [
      { slug: "terra-linda", name: "Terra Linda" },
      { slug: "lucas-valley", name: "Lucas Valley" }
    ] 
  },
  { 
    city: "Sunnyvale", 
    citySlug: "sunnyvale",
    neighborhoods: [
      { slug: "fairwood", name: "Fairwood" },
      { slug: "cherry-chase", name: "Cherry Chase" }
    ] 
  },
  { 
    city: "Walnut Creek", 
    citySlug: "walnut-creek",
    neighborhoods: [{ slug: "rancho-san-miguel", name: "Rancho San Miguel" }] 
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <img 
              src={EG_4_point_atomic_star} 
              alt="Eichler Glass" 
              className="h-10 w-auto"
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
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" data-testid="button-neighborhoods-dropdown">
                  Neighborhoods <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
                {neighborhoodGroups.map((group, index) => (
                  <div key={group.citySlug}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuLabel>
                      <Link href={`/${group.citySlug}`} className="hover:text-primary">
                        {group.city}
                      </Link>
                    </DropdownMenuLabel>
                    {group.neighborhoods.map((n) => (
                      <DropdownMenuItem key={n.slug} asChild>
                        <Link href={`/${n.slug}`} data-testid={`link-neighborhood-${n.slug}`}>
                          {n.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              className="hidden sm:flex gap-2"
              asChild
              data-testid="button-call-us"
            >
              <a href="tel:+15108593449">
                <Phone className="h-4 w-4" />
                Call Us
              </a>
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
        <div className="md:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground px-4 py-2 font-semibold">Neighborhoods</p>
              {neighborhoodGroups.map((group) => (
                <div key={group.citySlug} className="mb-2">
                  <Link href={`/${group.citySlug}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {group.city}
                    </Button>
                  </Link>
                  {group.neighborhoods.map((n) => (
                    <Link key={n.slug} href={`/${n.slug}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-8 text-sm"
                        onClick={() => setMobileOpen(false)}
                        data-testid={`link-mobile-neighborhood-${n.slug}`}
                      >
                        {n.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Button 
              variant="outline"
              className="w-full gap-2" 
              asChild
              data-testid="button-mobile-call"
            >
              <a href="tel:+15108593449">
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
