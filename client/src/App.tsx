import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import CityLanding from "@/pages/CityLanding";
import Pricing from "@/pages/Pricing";
import Services from "@/pages/Services";
import Book from "@/pages/Book";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Account from "@/pages/Account";
import Admin from "@/pages/Admin";
import BookingSuccess from "@/pages/BookingSuccess";
import BookingCancel from "@/pages/BookingCancel";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cancellation from "@/pages/Cancellation";
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
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={Admin} />
      <Route path="/booking/success" component={BookingSuccess} />
      <Route path="/booking/cancel" component={BookingCancel} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cancellation" component={Cancellation} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
