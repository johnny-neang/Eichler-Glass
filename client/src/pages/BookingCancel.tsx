import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Phone } from "lucide-react";

export default function BookingCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <div className="bg-muted p-4">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you're having trouble booking online, feel free to give us a call and we'll be happy to assist.
            </p>
            <a 
              href="tel:+14155551234" 
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-call-us"
            >
              <Phone className="w-4 h-4" />
              (415) 555-1234
            </a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
            <Button
              onClick={() => setLocation("/pricing")}
              data-testid="button-try-again"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
