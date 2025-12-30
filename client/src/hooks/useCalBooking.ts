import { useEffect, useCallback, useState } from "react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";

interface BookingOptions {
  tier?: string;
  city?: string;
}

type CalFunction = (action: string, ...args: unknown[]) => void;

function getCal(): CalFunction | undefined {
  return (window as unknown as { Cal?: CalFunction }).Cal;
}

export function useCalBooking() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!CAL_LINK) return;

    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
    
    if (existingScript) {
      const Cal = getCal();
      if (Cal) {
        setIsReady(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      const Cal = getCal();
      if (Cal) {
        Cal("init", { origin: "https://app.cal.com" });
        Cal("ui", {
          theme: "light",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        setIsReady(true);
      }
    };
    
    document.head.appendChild(script);

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
      console.log("Cal.com not loaded yet, retrying...");
      setTimeout(() => {
        const CalRetry = getCal();
        if (CalRetry) {
          CalRetry("modal", {
            calLink: CAL_LINK,
            config: { layout: "month_view" },
          });
        }
      }, 500);
    }
  }, []);

  return { 
    openCalModal,
    calLink: CAL_LINK,
    isReady
  };
}
