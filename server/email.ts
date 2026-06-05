import Mailjet from "node-mailjet";
import type { Lead } from "../shared/schema.js";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export async function sendLeadNotification(lead: Lead): Promise<boolean> {
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
