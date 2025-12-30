import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Phone } from "lucide-react";

interface CalBookingProps {
  calLink?: string;
}

export function CalBooking({ calLink }: CalBookingProps) {
  useEffect(() => {
    if (calLink) {
      (async function () {
        const cal = await getCalApi();
        cal("ui", {
          theme: "light",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      })();
    }
  }, [calLink]);

  if (!calLink || calLink === "eichlerglass/glass-cleaning") {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Online Booking Coming Soon</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our online scheduling system is being set up. In the meantime, please call us to book your appointment.
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            <a href="tel:+15108593449" className="font-semibold hover:text-primary transition-colors">
              (510) 859-3449
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full min-h-[600px]" data-testid="cal-booking-embed">
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
        config={{
          layout: "month_view",
        }}
      />
    </div>
  );
}
