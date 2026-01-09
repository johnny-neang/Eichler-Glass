import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do you specialize in Eichler homes?",
    answer: "Yes! We have extensive experience with Eichler and midcentury modern architecture. Our team understands the unique glass configurations, including floor-to-ceiling windows, post-and-beam construction, and various skylight styles common in these homes.",
  },
  {
    question: "How long does a typical cleaning take?",
    answer: "Interior cleaning typically takes 2-3 hours. Interior + Exterior takes 4-5 hours. Full service including skylights can take 5-6 hours depending on the size of your home and accessibility.",
  },
  {
    question: "Are you insured?",
    answer: "Absolutely. We carry full liability insurance and workers' compensation coverage. Your home and our team are fully protected during every service.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel or reschedule up to 48 hours before your appointment at no charge. Cancellations within 48 hours may be subject to a fee depending on circumstances.",
  },
  {
    question: "Do you clean screens and tracks?",
    answer: "Yes! Our Interior + Exterior and Full packages include screen cleaning and track/sill cleaning. This is essential for maintaining the full beauty of your windows.",
  },
  {
    question: "What if it rains after my window cleaning?",
    answer: "We offer a 7-day Rain Guarantee with our services. If it rains just after your windows have been cleaned, give us a call. We will come back and ensure your windows remain spotless at no extra cost.",
  },
];

interface FAQProps {
  cityName?: string;
}

export function FAQ({ cityName }: FAQProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            {cityName 
              ? `Common questions about our glass cleaning services in ${cityName}`
              : "Everything you need to know about our services"}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`accordion-faq-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
