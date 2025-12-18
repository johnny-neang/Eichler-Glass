import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
