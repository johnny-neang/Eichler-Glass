import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function BookingSuccess() {
  const [, setLocation] = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerifying(false);
      setVerified(true);
    }
  }, []);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await apiRequest("GET", `/api/deposits/verify/${sessionId}`);
      const result = await response.json();
      setVerified(result.success);
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Confirming your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">
            {verified ? "Deposit Received!" : "Thank You!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {verified ? (
            <>
              <p className="text-center text-muted-foreground">
                Your $50 deposit has been received. We'll be in touch shortly to confirm your appointment details.
              </p>
              <div className="bg-muted p-4">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>We'll call you within 24 hours to schedule your cleaning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Your deposit will be applied to your final bill</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              We've received your booking request. Our team will follow up with you shortly.
            </p>
          )}
          <div className="flex justify-center">
            <Button
              onClick={() => setLocation("/")}
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
