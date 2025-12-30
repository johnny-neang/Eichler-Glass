import { useEffect, useCallback, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { apiRequest } from "@/lib/queryClient";

const CAL_LINK = import.meta.env.VITE_CAL_LINK || "";

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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleLeadCaptured = useCallback(async (leadId: string, data: { name: string; email: string; city?: string; packageTier?: string }) => {
    setPendingOptions({});
    setIsProcessing(true);
    
    try {
      const response = await apiRequest("POST", "/api/deposits/create-checkout", { leadId });
      const result = await response.json();
      
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setIsProcessing(false);
      if (CAL_LINK) {
        openCalModal({
          tier: data.packageTier,
          city: data.city,
          name: data.name,
          email: data.email,
          leadId,
        });
      }
    }
  }, [openCalModal]);

  return { 
    initiateBooking,
    openCalModal,
    dialogOpen,
    setDialogOpen,
    handleLeadCaptured,
    pendingOptions,
    isProcessing,
    calLink: CAL_LINK 
  };
}
