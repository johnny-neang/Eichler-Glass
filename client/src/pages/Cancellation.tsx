import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Cancellation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-2">Cancellation Policy</h1>
          <p className="text-foreground/60 mb-8">Last updated: December 2024</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p>
                This Cancellation Policy outlines the terms and conditions for cancelling, rescheduling, or modifying your glass cleaning service appointment with Eichler Glass. We designed this policy to be fair to both our customers and our service team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Booking Deposit</h2>
              <p>
                A non-refundable $50 deposit is required to secure your appointment. This deposit:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reserves your preferred date and time</li>
                <li>Is applied toward your final invoice</li>
                <li>Is forfeited if you cancel with less than 48 hours notice</li>
                <li>Is fully refundable only under the circumstances outlined in this policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cancellation Timeline</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-foreground/20">
                  <h3 className="text-lg font-semibold mb-2">More Than 48 Hours Before Service</h3>
                  <p>
                    <strong>Full Refund:</strong> Your $50 deposit will be fully refunded if you cancel more than 48 hours before your scheduled appointment time. No questions asked.
                  </p>
                </div>

                <div className="p-4 border border-foreground/20">
                  <h3 className="text-lg font-semibold mb-2">24-48 Hours Before Service</h3>
                  <p>
                    <strong>Deposit Forfeited:</strong> Cancellations within this window will result in forfeiture of your $50 deposit. We are unable to process refunds for cancellations made between 24-48 hours before service.
                  </p>
                </div>

                <div className="p-4 border border-foreground/20">
                  <h3 className="text-lg font-semibold mb-2">Less Than 24 Hours Before Service</h3>
                  <p>
                    <strong>Deposit Forfeited + Late Cancellation Fee:</strong> Cancellations made within 24 hours of your appointment will result in forfeiture of your $50 deposit plus a $25 late cancellation fee. This fee reflects the costs we incur from our team, scheduling coordination, and other resources allocated for your service.
                  </p>
                </div>

                <div className="p-4 border border-foreground/20">
                  <h3 className="text-lg font-semibold mb-2">No-Show</h3>
                  <p>
                    <strong>Full Payment Due:</strong> If you miss your appointment without contacting us, your $50 deposit will be forfeited and you may be charged the full estimated service cost.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Rescheduling</h2>
              <p>
                You may reschedule your appointment without penalty if you request a new date and time:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>More than 48 hours before:</strong> Reschedule to any available date with no additional fees or deposit changes
                </li>
                <li>
                  <strong>24-48 hours before:</strong> Available to reschedule but your original deposit is forfeited and a new $50 deposit is required for the rescheduled date
                </li>
                <li>
                  <strong>Less than 24 hours before:</strong> Rescheduling is limited based on our availability and is handled on a case-by-case basis with our team
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Scope Changes</h2>
              <p>
                If you need to modify the scope of services (e.g., adding additional areas to clean):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifications made more than 48 hours in advance are free if within reason</li>
                <li>Significant scope additions may require a new quote and adjusted deposit</li>
                <li>Contact us as soon as possible to discuss modifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Exceptions and Special Circumstances</h2>
              <p>
                We understand that life happens. The following circumstances may qualify for a full refund or deposit credit even within the cancellation window:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Legitimate medical emergencies</li>
                <li>Unexpected home repairs or urgent maintenance required on the scheduled date</li>
                <li>Death or serious illness in the family</li>
                <li>Severe weather that makes travel unsafe</li>
                <li>Service cancellation initiated by Eichler Glass</li>
              </ul>
              <p className="mt-4">
                Requests for exceptions must be made in writing to hello@eichlerglass.com with supporting documentation when applicable. We will review each request fairly and individually.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Weather-Related Cancellations</h2>
              <p>
                If we determine that severe weather makes it unsafe to perform services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will reschedule your appointment to the next available date at no additional charge</li>
                <li>Your $50 deposit carries over to the rescheduled date</li>
                <li>You may request a full refund if you prefer to cancel entirely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. How to Cancel or Reschedule</h2>
              <p>
                To cancel or reschedule your appointment:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact us via email at hello@eichlerglass.com with your appointment details</li>
                <li>Or call us at (510) 859-3449 during business hours</li>
                <li>Provide your name, appointment date, and the reason for cancellation/rescheduling</li>
                <li>We will process your request within 24 business hours</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Refund Processing</h2>
              <p>
                Approved refunds will be processed to your original payment method:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refunds are processed within 5-10 business days</li>
                <li>You will receive a confirmation email when your refund is initiated</li>
                <li>Bank processing times vary; check with your financial institution if refund doesn't appear within 10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Policy Changes</h2>
              <p>
                We reserve the right to update this Cancellation Policy with reasonable notice. Changes will be posted on our website, and your continued use of our services constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p>
                For questions about this Cancellation Policy or to request cancellation/rescheduling:
              </p>
              <div className="mt-4 p-4 bg-background/50">
                <p><strong>Email:</strong> hello@eichlerglass.com</p>
                <p><strong>Phone:</strong> (510) 859-3449</p>
                <p><strong>Service Area:</strong> Bay Area, California</p>
              </div>
            </section>

            <section className="mt-8 p-4 bg-primary/10 border border-primary/20">
              <p className="text-sm">
                <strong>Summary:</strong> Cancel with 48+ hours notice for a full refund. Cancel 24-48 hours before and forfeit your $50 deposit. Cancel within 24 hours and forfeit your deposit plus a $25 fee. We're committed to being fair while respecting our team's time and resources.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
