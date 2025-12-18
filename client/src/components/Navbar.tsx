import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const cities = [
  { slug: "greenridge", name: "Greenridge, Castro Valley" },
  { slug: "sequoyah-hills", name: "Sequoyah Hills, Oakland" },
  { slug: "rancho-san-miguel", name: "Rancho San Miguel, Walnut Creek" },
  { slug: "rancho-del-diablo", name: "Rancho del Diablo, Concord" },
  { slug: "parkside", name: "Parkside, Concord" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EG</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              Eichler Glass
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={
                    location === link.href
                      ? "text-primary border-b-2 border-primary rounded-none"
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
                  Cities <ChevronDown className="ml-1 h-4 w-4" />
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
            <Link href="/book" className="hidden sm:block">
              <Button className="rounded-full px-6" data-testid="button-book-now">
                Book Now
              </Button>
            </Link>
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
              <p className="text-sm text-muted-foreground px-4 py-2">Service Areas</p>
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
            <Link href="/book" className="block pt-2">
              <Button className="w-full rounded-full" data-testid="button-mobile-book">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
