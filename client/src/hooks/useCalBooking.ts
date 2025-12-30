import { useEffect, useCallback } from "react";
import { getCalApi } from "@calcom/embed-react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";

interface BookingOptions {
  tier?: string;
  city?: string;
}

export function useCalBooking() {
  useEffect(() => {
    if (!CAL_LINK) return;
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const openCalModal = useCallback(async (options?: BookingOptions) => {
    if (!CAL_LINK) {
      console.log("Cal.com not configured");
      return;
    }
    
    const cal = await getCalApi();
    
    const config: Record<string, string> = {
      layout: "month_view",
    };
    
    if (options?.tier) {
      config.notes = `Selected Package: ${options.tier}`;
    }
    if (options?.city) {
      config.location = options.city;
    }

    cal("modal", {
      calLink: CAL_LINK,
      config,
    });
  }, []);

  return { 
    openCalModal,
    calLink: CAL_LINK 
  };
}
