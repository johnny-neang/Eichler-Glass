import { useEffect, useCallback } from "react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";
const CAL_NAMESPACE = "eichler-glass";

interface BookingOptions {
  tier?: string;
  city?: string;
}

type CalFunction = (action: string, ...args: unknown[]) => void;

function getCal(): CalFunction | undefined {
  return (window as unknown as { Cal?: CalFunction }).Cal;
}

export function useCalBooking() {
  useEffect(() => {
    if (!CAL_LINK) return;

    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      const Cal = getCal();
      if (Cal) {
        Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
        Cal("ui", {
          theme: "light",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      }
    };
    
    if (!document.querySelector('script[src="https://app.cal.com/embed/embed.js"]')) {
      document.head.appendChild(script);
    }

    return () => {};
  }, []);

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
      window.open(`https://cal.com/${CAL_LINK}`, "_blank");
    }
  }, []);

  return { 
    openCalModal,
    calLink: CAL_LINK 
  };
}
