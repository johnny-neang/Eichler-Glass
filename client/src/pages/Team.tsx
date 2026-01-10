import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Sparkles, ArrowRight, Phone } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/about-hero.jpg";

const teamMembers = [
  {
    name: "Niño",
    role: "Founder",
    initials: "NI",
    bio: "A Greenridge resident and former MP of Aero Living, Niño founded Eichler Glass to help neighbors maintain the beauty of their midcentury homes with the same care as his own.",
  },
  {
    name: "JP",
    role: "Co-Founder & Operations Manager",
    initials: "JP",
    bio: "A Greenridge resident, educator and professional artist, JP assures scopes are clear, details are defined and our clients receive the exceptional service they deserve.",
  },
  {
    name: "Sean",
    role: "Co-Founder & Senior Technician",
    initials: "SE",
    bio: "A Greenridge resident, world-traveller and die hard Warriors fan, Sean plays by the book and enforces standards are upheld and executed to expectation.",
  },
];

const beforeAfterImages = [
  {
    id: 1,
    title: "Clerestory Windows",
    description: "Restoring clarity to iconic midcentury design elements",
  },
  {
    id: 2,
    title: "Atrium Glass",
    description: "Bringing the outdoors back into focus",
  },
  {
    id: 3,
    title: "Sliding Glass Doors",
    description: "Seamless transitions between indoor and outdoor living",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section 
          className="relative py-24 md:py-32 min-h-[50vh] flex items-center"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white" data-testid="text-team-title">
                About Us
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Your neighbors, dedicated to preserving the beauty of midcentury modern homes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold m-0" data-testid="text-about-heading">
                  Proudly Rooted in Greenridge
                </h2>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We proudly live in the Greenridge neighborhood together and deeply value preserving the light and architecture that make our homes so special. We understand the importance of our homes' connection to nature and the thoughtful design that brings the outdoors in.
              </p>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our windows are the frames that allow us and others to enjoy the beauty both inside and out. They're not just glass panels—they're carefully designed portals that connect us to the natural world, flood our living spaces with light, and showcase the architectural vision that makes Eichler and midcentury modern homes so beloved.
              </p>

              <div className="flex items-center gap-3 mb-6 mt-12">
                <div className="p-3 bg-primary/10">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold m-0">
                  We Get It—Because We Live It
                </h2>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                As fellow Eichler homeowners, we know the unique joy of watching morning light stream through clerestory windows, or hosting friends who marvel at the seamless flow between your living room and garden. We also know how quickly that magic fades when glass becomes clouded with dust, water spots, or years of buildup.
              </p>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                That's why we started Eichler Glass—to help our neighbors reclaim the brilliance of their homes. Every window we clean is a reminder of why we fell in love with these homes in the first place.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-team-members-title">
                Meet the Team
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your neighbors, committed to excellence in every pane.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center" data-testid={`card-team-${member.initials.toLowerCase()}`}>
                  <CardContent className="pt-8 pb-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-xl mb-4">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold" data-testid="text-before-after-title">
                  The Transformation
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See the difference professional glass cleaning makes for homes like yours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {beforeAfterImages.map((item) => (
                <Card key={item.id} className="overflow-hidden" data-testid={`card-before-after-${item.id}`}>
                  <div className="aspect-[4/3] bg-muted relative">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 bg-muted-foreground/20 flex items-center justify-center border-r border-background">
                        <span className="text-sm text-muted-foreground font-medium">Before</span>
                      </div>
                      <div className="w-1/2 bg-primary/10 flex items-center justify-center">
                        <span className="text-sm text-primary font-medium">After</span>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-background flex items-center justify-center">
                      <div className="w-8 h-8 bg-background border-2 border-primary flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get your free quote today and experience the difference that dedicated, local professionals make.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2"
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingWizard'))}
                data-testid="button-about-cta-quote"
              >
                Get Your Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2"
                asChild
                data-testid="button-about-cta-call"
              >
                <a href="tel:+15108593449">
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
