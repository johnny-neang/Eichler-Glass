import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBookingWizard } from "@/components/BookingWizard";

export default function Book() {
  const { openWizard } = useBookingWizard();

  useEffect(() => {
    openWizard();
  }, [openWizard]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/50">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-booking-title">
              Book Your Cleaning
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Fill out our quick form to get a quote and schedule your professional glass cleaning service.
            </p>
            <button
              onClick={() => openWizard()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium hover-elevate"
              data-testid="button-open-booking"
            >
              Start Booking
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
