import { useCallback } from "react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";
const CAL_DIRECT_URL = `https://cal.com/${CAL_LINK}`;

interface BookingOptions {
  tier?: string;
  city?: string;
}

type CalFunction = (...args: unknown[]) => void;

function getCal(): CalFunction | undefined {
  const win = window as unknown as { Cal?: CalFunction };
  if (win.Cal && typeof win.Cal === "function") {
    return win.Cal;
  }
  return undefined;
}

export function useCalBooking() {
  const openCalModal = useCallback((options?: BookingOptions) => {
    if (!CAL_LINK) {
      console.log("Cal.com not configured");
      return;
    }
    
    const Cal = getCal();
    
    if (Cal) {
      try {
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
      } catch (error) {
        console.error("Cal.com modal error, opening direct link:", error);
        window.open(CAL_DIRECT_URL, "_blank", "noopener,noreferrer");
      }
    } else {
      console.log("Cal.com embed not available, opening direct link");
      window.open(CAL_DIRECT_URL, "_blank", "noopener,noreferrer");
    }
  }, []);

  return { 
    openCalModal,
    calLink: CAL_LINK,
    calDirectUrl: CAL_DIRECT_URL
  };
}
