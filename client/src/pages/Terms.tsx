import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-serif text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="space-y-8">
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-foreground leading-relaxed">
                These Terms of Service ("Terms") constitute a legal agreement between you and Eichler Glass ("Company," "we," or "us"). By accessing our website and booking our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">2. Services Provided</h2>
              <p className="text-foreground leading-relaxed">
                Eichler Glass provides professional glass cleaning services for residential properties in the Bay Area. Services include exterior window cleaning, interior window cleaning, skylight cleaning, and related services as described on our website. All services are performed in accordance with industry standards and best practices.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">3. Booking and Reservations</h2>
              <p className="text-foreground leading-relaxed">
                When you book a service, you agree to provide accurate and complete information. A deposit may be required to confirm your appointment. This deposit is applied toward your final invoice. Bookings are confirmed via email and calendar scheduling through our Cal.com integration.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">4. Pricing and Payment</h2>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>All prices are quoted in USD</li>
                <li>Pricing is valid for 30 days from the quote date</li>
                <li>A deposit may be required at booking</li>
                <li>Full payment is due upon completion of services</li>
                <li>We accept payment via Stripe for secure credit card transactions</li>
                <li>Prices may increase if additional services beyond the original scope are requested</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">5. Rescheduling and Cancellations</h2>
              <p className="text-foreground leading-relaxed">
                Appointments must be rescheduled or cancelled at least 48 hours in advance. Cancellations made less than 48 hours before the scheduled service time may result in forfeiture of your booking deposit. Please refer to our Cancellation Policy for complete details.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">6. Property Access</h2>
              <p className="text-foreground leading-relaxed mb-4">
                You agree to provide our team with safe access to all areas requiring cleaning. This includes:
              </p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>Safe access to ladders, scaffolding, or equipment we may need to use</li>
                <li>Notice of any hazards or safety concerns at your property</li>
                <li>Access to water sources and electrical outlets if required</li>
                <li>Notification of any structural issues or fragile glass that requires special handling</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">7. Liability and Damages</h2>
              <p className="text-foreground leading-relaxed mb-4">
                While we take every precaution to perform our services safely, we are not responsible for:
              </p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>Pre-existing damage to windows or glass</li>
                <li>Damage resulting from defective or improperly installed glass</li>
                <li>Structural damage to your property</li>
                <li>Personal injuries to property occupants</li>
                <li>Damage to personal property not related to our cleaning services</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                We maintain comprehensive liability insurance. Any valid claims for damage directly caused by our negligence must be reported within 48 hours of service completion.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">8. Service Guarantee</h2>
              <p className="text-foreground leading-relaxed">
                We guarantee a streak-free finish on all cleaned glass surfaces when weather conditions permit. If you are unsatisfied with the results, please contact us within 24 hours to request a re-clean at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">9. Weather Conditions</h2>
              <p className="text-foreground leading-relaxed">
                Heavy rain or extreme weather may affect the quality of our work or require rescheduling. We will notify you promptly if weather conditions make it unsafe or impossible to perform services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">10. Code of Conduct</h2>
              <p className="text-foreground leading-relaxed">
                We expect all customers to treat our team members with respect. Any abusive, threatening, or discriminatory behavior will result in immediate service termination without refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <p className="text-foreground leading-relaxed">
                To the maximum extent permitted by law, Eichler Glass's total liability for any damages shall not exceed the amount paid for the service in question.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">12. Dispute Resolution</h2>
              <p className="text-foreground leading-relaxed">
                Any disputes shall be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be governed by the laws of California and resolved in the appropriate courts of the Bay Area.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">13. Changes to Terms</h2>
              <p className="text-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of our services constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p className="text-foreground leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="p-6 bg-muted border border-border">
                <p className="text-foreground"><strong>Email:</strong> hello@eichlerglass.com</p>
                <p className="text-foreground"><strong>Phone:</strong> (510) 859-3449</p>
                <p className="text-foreground"><strong>Service Area:</strong> Bay Area, California</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
