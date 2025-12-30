import { useEffect, useCallback } from "react";
import { getCalApi } from "@calcom/embed-react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "eichlerglass/glass-cleaning";

export function useCalBooking() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const openBooking = useCallback(async (options?: { tier?: string; city?: string }) => {
    const cal = await getCalApi();
    
    const prefill: Record<string, string> = {};
    if (options?.tier) {
      prefill.notes = `Selected Package: ${options.tier}`;
    }
    if (options?.city) {
      prefill.location = options.city;
    }

    cal("modal", {
      calLink: CAL_LINK,
      config: {
        layout: "month_view",
        ...prefill,
      },
    });
  }, []);

  const isConfigured = CAL_LINK !== "eichlerglass/glass-cleaning";

  return { openBooking, isConfigured, calLink: CAL_LINK };
}
