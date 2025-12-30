import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalBooking } from "@/components/CalBooking";

export default function Book() {
  const calLink = import.meta.env.VITE_CAL_LINK || "eichlerglass/glass-cleaning";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/50">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-booking-title">
                Book Your Cleaning
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a convenient time for your professional glass cleaning service. 
                We'll confirm your appointment within 24 hours.
              </p>
            </div>
            <CalBooking calLink={calLink} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
