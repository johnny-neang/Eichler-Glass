import { useParams, useSearch } from "wouter";
import { Navbar } from "@/components/Navbar";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";

const cityData: Record<string, { name: string }> = {
  "castro-valley": { name: "Castro Valley" },
  "concord": { name: "Concord" },
  "walnut-creek": { name: "Walnut Creek" },
};

export default function Book() {
  const params = useParams<{ city?: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const tier = searchParams.get("tier") || undefined;
  const city = params.city ? cityData[params.city] : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BookingForm cityName={city?.name} preselectedTier={tier} />
      </main>
      <Footer />
    </div>
  );
}
