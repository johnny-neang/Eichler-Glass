import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingWizardProvider } from "@/components/BookingWizard";
import Home from "@/pages/Home";
import CityLanding from "@/pages/CityLanding";
import Pricing from "@/pages/Pricing";
import Services from "@/pages/Services";
import Book from "@/pages/Book";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cancellation from "@/pages/Cancellation";
import AdminLeads from "@/pages/AdminLeads";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/services" component={Services} />
      <Route path="/book" component={Book} />
      <Route path="/contact" component={Contact} />
      <Route path="/team" component={Team} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cancellation" component={Cancellation} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/:city" component={CityLanding} />
      <Route path="/:city/book" component={Book} />
      <Route path="/:city/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookingWizardProvider>
          <Toaster />
          <Router />
        </BookingWizardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
