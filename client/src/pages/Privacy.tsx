import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-serif text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="space-y-8">
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-foreground leading-relaxed">
                Eichler Glass ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our glass cleaning services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-foreground leading-relaxed mb-4">We may collect information about you in a variety of ways:</p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>
                  <strong>Contact Information:</strong> Name, email address, phone number, and physical address provided through booking forms or contact pages
                </li>
                <li>
                  <strong>Service Information:</strong> Details about services requested, scheduling preferences, and specific requirements for your property
                </li>
                <li>
                  <strong>Payment Information:</strong> Billing address and payment details processed securely through Stripe. We do not store complete credit card numbers
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and device information
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies to enhance your browsing experience and remember your preferences
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>To schedule and provide glass cleaning services</li>
                <li>To process payments and refunds</li>
                <li>To send service confirmations, updates, and notifications</li>
                <li>To respond to your inquiries and customer support requests</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">4. Information Sharing</h2>
              <p className="text-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>
                  <strong>Service Providers:</strong> Third-party service providers who assist us in operating our website and conducting our business (e.g., payment processors, email service providers)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">6. Retention of Your Information</h2>
              <p className="text-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your information at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-foreground leading-relaxed mb-4">Depending on your location, you may have rights including:</p>
              <ul className="list-disc space-y-2 ml-6 text-foreground">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Objection to processing of your information</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                To exercise any of these rights, please contact us at hello@eichlerglass.com.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">8. Third-Party Links</h2>
              <p className="text-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing your information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website and updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-foreground leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
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
