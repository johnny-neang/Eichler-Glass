import Mailjet from "node-mailjet";

const mailjet = process.env.MJ_APIKEY_PUBLIC && process.env.MJ_APIKEY_PRIVATE
  ? new Mailjet({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    })
  : null;

const FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || "noreply@eichlerglass.com";
const FROM_NAME = "Eichler Glass";

interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  textPart: string;
  htmlPart: string;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!mailjet) {
    console.log("Mailjet not configured, skipping email:", params.subject);
    return false;
  }

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME,
          },
          To: [
            {
              Email: params.to,
              Name: params.toName || params.to,
            },
          ],
          Subject: params.subject,
          TextPart: params.textPart,
          HTMLPart: params.htmlPart,
        },
      ],
    });
    console.log(`Email sent successfully to ${params.to}: ${params.subject}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export const EmailService = {
  async sendDepositConfirmation(
    email: string,
    name: string,
    amount: number
  ): Promise<boolean> {
    const formattedAmount = (amount / 100).toFixed(2);
    return sendEmail({
      to: email,
      toName: name,
      subject: "Deposit Confirmed - Eichler Glass",
      textPart: `Hi ${name},

Thank you for your $${formattedAmount} deposit! Your booking is now secured.

We'll be in touch soon to confirm your appointment details.

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Deposit Confirmed</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your <strong>$${formattedAmount}</strong> deposit! Your booking is now secured.</p>
          <p>We'll be in touch soon to confirm your appointment details.</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },

  async sendAppointmentConfirmation(
    email: string,
    name: string,
    scheduledDate: Date,
    timeWindow: string,
    address: string
  ): Promise<boolean> {
    const dateStr = scheduledDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return sendEmail({
      to: email,
      toName: name,
      subject: "Appointment Confirmed - Eichler Glass",
      textPart: `Hi ${name},

Your glass cleaning appointment is confirmed!

Date: ${dateStr}
Time: ${timeWindow}
Address: ${address}

Our team will arrive during your scheduled time window. Please ensure access to all windows that need cleaning.

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Appointment Confirmed</h2>
          <p>Hi ${name},</p>
          <p>Your glass cleaning appointment is confirmed!</p>
          <div style="background: #f4f4f2; padding: 20px; margin: 20px 0;">
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeWindow}</p>
            <p><strong>Address:</strong> ${address}</p>
          </div>
          <p>Our team will arrive during your scheduled time window. Please ensure access to all windows that need cleaning.</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },

  async sendJobCompletedNotification(
    email: string,
    name: string,
    invoiceTotal: number,
    depositApplied: number,
    remainingBalance: number
  ): Promise<boolean> {
    const totalStr = (invoiceTotal / 100).toFixed(2);
    const depositStr = (depositApplied / 100).toFixed(2);
    const balanceStr = (remainingBalance / 100).toFixed(2);

    return sendEmail({
      to: email,
      toName: name,
      subject: "Service Completed - Eichler Glass",
      textPart: `Hi ${name},

Your glass cleaning service has been completed!

Invoice Summary:
- Total: $${totalStr}
- Deposit Applied: -$${depositStr}
- ${remainingBalance > 0 ? `Remaining Balance: $${balanceStr}` : "Balance: PAID"}

Thank you for choosing Eichler Glass. We hope you're delighted with your sparkling clean windows!

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Service Completed</h2>
          <p>Hi ${name},</p>
          <p>Your glass cleaning service has been completed!</p>
          <div style="background: #f4f4f2; padding: 20px; margin: 20px 0;">
            <h3>Invoice Summary</h3>
            <p><strong>Total:</strong> $${totalStr}</p>
            <p><strong>Deposit Applied:</strong> -$${depositStr}</p>
            <p><strong>${remainingBalance > 0 ? `Remaining Balance: $${balanceStr}` : "Balance: PAID"}</strong></p>
          </div>
          <p>Thank you for choosing Eichler Glass. We hope you're delighted with your sparkling clean windows!</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },

  async sendPaymentReceived(
    email: string,
    name: string,
    amount: number
  ): Promise<boolean> {
    const amountStr = (amount / 100).toFixed(2);
    return sendEmail({
      to: email,
      toName: name,
      subject: "Payment Received - Eichler Glass",
      textPart: `Hi ${name},

We've received your payment of $${amountStr}. Thank you!

If you have any questions, please don't hesitate to reach out.

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Payment Received</h2>
          <p>Hi ${name},</p>
          <p>We've received your payment of <strong>$${amountStr}</strong>. Thank you!</p>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },

  async sendRefundNotification(
    email: string,
    name: string,
    amount: number
  ): Promise<boolean> {
    const amountStr = (amount / 100).toFixed(2);
    return sendEmail({
      to: email,
      toName: name,
      subject: "Refund Processed - Eichler Glass",
      textPart: `Hi ${name},

A refund of $${amountStr} has been processed to your original payment method. It may take 5-10 business days to appear on your statement.

If you have any questions, please don't hesitate to reach out.

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Refund Processed</h2>
          <p>Hi ${name},</p>
          <p>A refund of <strong>$${amountStr}</strong> has been processed to your original payment method. It may take 5-10 business days to appear on your statement.</p>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },

  async sendLeadConvertedToClient(
    email: string,
    name: string
  ): Promise<boolean> {
    return sendEmail({
      to: email,
      toName: name,
      subject: "Welcome to the Eichler Glass Family!",
      textPart: `Hi ${name},

Welcome to the Eichler Glass family! We're thrilled to have you as a client.

Your work order has been created and our team will be in touch shortly to schedule your service.

Thank you for trusting us with your midcentury modern home's glass care.

Best regards,
The Eichler Glass Team`,
      htmlPart: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5FB3B3;">Welcome to Eichler Glass!</h2>
          <p>Hi ${name},</p>
          <p>Welcome to the Eichler Glass family! We're thrilled to have you as a client.</p>
          <p>Your work order has been created and our team will be in touch shortly to schedule your service.</p>
          <p>Thank you for trusting us with your midcentury modern home's glass care.</p>
          <p>Best regards,<br/>The Eichler Glass Team</p>
        </div>
      `,
    });
  },
};
