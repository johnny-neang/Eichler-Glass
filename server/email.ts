import Mailjet from "node-mailjet";
import type { Lead } from "../shared/schema.js";

// Lazily create the Mailjet client so a missing/incomplete API key doesn't
// crash the whole serverless function at import time. Returns null when the
// credentials aren't configured, in which case we skip sending.
function getMailjetClient(): Mailjet | null {
  const apiKey = process.env.MJ_APIKEY_PUBLIC;
  const apiSecret = process.env.MJ_APIKEY_PRIVATE;
  if (!apiKey || !apiSecret) {
    return null;
  }
  return new Mailjet({ apiKey, apiSecret });
}

export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const mailjet = getMailjetClient();
  if (!mailjet) {
    console.warn(
      "Mailjet credentials not configured; skipping lead email notification.",
    );
    return false;
  }

  const senderEmail = process.env.MJ_SENDER_EMAIL || "hello@eichlerglass.com";
  
  const servicesFormatted = lead.services.join(", ");
  
  const emailBody = `
New Lead Submitted!

Name: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
Phone: ${lead.phone}

Location: ${lead.location}
Property Type: ${lead.propertyType}
Services: ${servicesFormatted}
Frequency: ${lead.frequency}

Address:
${lead.street}
${lead.city}, ${lead.state} ${lead.zip}

How they heard about us: ${lead.referralSource || "Not specified"}
Promo Code: ${lead.promoCode || "None"}

Submitted from: ${lead.pageUrl || "Unknown page"}
Submitted at: ${lead.createdAt.toLocaleString()}
  `.trim();

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: "Eichler Glass Website",
          },
          To: [
            {
              Email: "hello@eichlerglass.com",
              Name: "Eichler Glass Team",
            },
          ],
          ReplyTo: {
            Email: lead.email,
            Name: `${lead.firstName} ${lead.lastName}`,
          },
          Subject: `New Lead: ${lead.firstName} ${lead.lastName} - ${lead.location}`,
          TextPart: emailBody,
        },
      ],
    });
    console.log(`Email notification sent for lead ${lead.id}`);
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return false;
  }
}
