import { useEffect, useCallback, useState } from "react";
import { getCalApi } from "@calcom/embed-react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "eichlerglass/glass-cleaning";

interface BookingOptions {
  tier?: string;
  city?: string;
  name?: string;
  email?: string;
  leadId?: string;
}

export function useCalBooking() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingOptions, setPendingOptions] = useState<{ tier?: string; city?: string }>({});

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

  const openCalModal = useCallback(async (options?: BookingOptions) => {
    const cal = await getCalApi();
    
    const config: Record<string, string> = {
      layout: "month_view",
    };
    
    if (options?.name) {
      config.name = options.name;
    }
    if (options?.email) {
      config.email = options.email;
    }
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

  const initiateBooking = useCallback((options?: { tier?: string; city?: string }) => {
    setPendingOptions(options || {});
    setDialogOpen(true);
  }, []);

  const handleLeadCaptured = useCallback((leadId: string, data: { name: string; email: string; city?: string; packageTier?: string }) => {
    setPendingOptions({});
    
    openCalModal({
      tier: data.packageTier,
      city: data.city,
      name: data.name,
      email: data.email,
      leadId,
    });
  }, [openCalModal]);

  return { 
    initiateBooking,
    openCalModal,
    dialogOpen,
    setDialogOpen,
    handleLeadCaptured,
    pendingOptions,
    calLink: CAL_LINK 
  };
}
