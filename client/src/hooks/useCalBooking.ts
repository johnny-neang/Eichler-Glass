import { useCallback } from "react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";

interface BookingOptions {
  tier?: string;
  city?: string;
}

type CalFunction = (...args: unknown[]) => void;

function getCal(): CalFunction | undefined {
  return (window as unknown as { Cal?: CalFunction }).Cal;
}

export function useCalBooking() {
  const openCalModal = useCallback((options?: BookingOptions) => {
    if (!CAL_LINK) {
      console.log("Cal.com not configured");
      return;
    }
    
    const Cal = getCal();
    if (Cal) {
      const config: Record<string, string> = {
        layout: "month_view",
      };
      
      if (options?.tier) {
        config.notes = `Selected Package: ${options.tier}`;
      }
      if (options?.city) {
        config.location = options.city;
      }

      Cal("modal", {
        calLink: CAL_LINK,
        config,
      });
    } else {
      console.error("Cal.com not loaded");
    }
  }, []);

  return { 
    openCalModal,
    calLink: CAL_LINK
  };
}
