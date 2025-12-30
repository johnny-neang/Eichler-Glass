import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;
import { storage } from "./storage";
import { insertLeadSchema, insertDepositSchema, insertWorkOrderSchema, insertClientSchema, updateLeadSchema, updateDepositSchema, updateWorkOrderSchema, updateClientSchema } from "@shared/schema";
import { z } from "zod";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { EmailService } from "./emailService";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
    adminUsername?: string;
  }
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required for secure sessions");
  }

  const PgStore = connectPgSimple(session);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(session({
    store: new PgStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }));

  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateAdminLastLogin(admin.id);
      
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      
      res.json({ success: true, username: admin.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/auth/me", requireAuth, (req, res) => {
    res.json({ username: req.session.adminUsername });
  });

  app.get("/api/admin/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/leads", requireAuth, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/:id", requireAuth, async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.post("/api/admin/leads", requireAuth, async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.patch("/api/admin/leads/:id", requireAuth, async (req, res) => {
    try {
      const data = updateLeadSchema.parse(req.body);
      const lead = await storage.updateLead(req.params.id, data);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.delete("/api/admin/leads/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.get("/api/admin/deposits", requireAuth, async (req, res) => {
    try {
      const deposits = await storage.getDeposits();
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deposits" });
    }
  });

  app.get("/api/admin/deposits/:id", requireAuth, async (req, res) => {
    try {
      const deposit = await storage.getDeposit(req.params.id);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      res.json(deposit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deposit" });
    }
  });

  app.post("/api/admin/deposits", requireAuth, async (req, res) => {
    try {
      const data = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit(data);
      res.status(201).json(deposit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create deposit" });
    }
  });

  app.patch("/api/admin/deposits/:id", requireAuth, async (req, res) => {
    try {
      const data = updateDepositSchema.parse(req.body);
      const deposit = await storage.updateDeposit(req.params.id, data);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      res.json(deposit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update deposit" });
    }
  });

  app.get("/api/admin/work-orders", requireAuth, async (req, res) => {
    try {
      const workOrders = await storage.getWorkOrders();
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work orders" });
    }
  });

  app.get("/api/admin/work-orders/:id", requireAuth, async (req, res) => {
    try {
      const workOrder = await storage.getWorkOrder(req.params.id);
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }
      res.json(workOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work order" });
    }
  });

  app.post("/api/admin/work-orders", requireAuth, async (req, res) => {
    try {
      const data = insertWorkOrderSchema.parse(req.body);
      const workOrder = await storage.createWorkOrder(data);
      res.status(201).json(workOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create work order" });
    }
  });

  app.patch("/api/admin/work-orders/:id", requireAuth, async (req, res) => {
    try {
      const data = updateWorkOrderSchema.parse(req.body);
      const workOrder = await storage.updateWorkOrder(req.params.id, data);
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }
      res.json(workOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update work order" });
    }
  });

  app.delete("/api/admin/work-orders/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteWorkOrder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Work order not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete work order" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, city, message } = req.body;
      
      const lead = await storage.createLead({
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        serviceCity: city,
        notes: message,
        source: "contact_form",
      });
      
      res.status(201).json({ success: true, leadId: lead.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  const publicLeadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    city: z.string().optional(),
    packageTier: z.string().optional(),
  });

  app.post("/api/leads/public", async (req, res) => {
    try {
      const data = publicLeadSchema.parse(req.body);
      
      const lead = await storage.createLead({
        contactName: data.name,
        contactEmail: data.email,
        contactPhone: data.phone || null,
        serviceCity: data.city || null,
        serviceTier: data.packageTier || null,
        notes: data.packageTier ? `Booking intent: ${data.packageTier}` : "Booking intent",
        source: "booking_flow",
      });
      
      res.status(201).json({ 
        success: true, 
        leadId: lead.id,
        message: "Lead captured successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Public lead error:", error);
      res.status(500).json({ error: "Failed to capture lead" });
    }
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe publishable key:", error);
      res.status(500).json({ error: "Failed to get Stripe key" });
    }
  });

  app.post("/api/deposits/create-checkout", async (req, res) => {
    try {
      const { leadId, successUrl, cancelUrl } = req.body;
      
      if (!leadId) {
        return res.status(400).json({ error: "Lead ID is required" });
      }

      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const stripe = await getUncachableStripeClient();

      let customerId = lead.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: lead.contactEmail,
          name: lead.contactName,
          phone: lead.contactPhone || undefined,
          metadata: { leadId: lead.id },
        });
        customerId = customer.id;
        await storage.updateLead(leadId, { stripeCustomerId: customerId });
      }

      const deposit = await storage.createDeposit({
        leadId: lead.id,
        amount: 5000,
        method: "stripe",
        status: "pending",
        memo: `Deposit for ${lead.serviceTier || "cleaning service"}`,
      });

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Glass Cleaning Deposit",
                description: `$50 deposit to hold your appointment - ${lead.serviceTier || "Standard Service"}`,
              },
              unit_amount: 5000,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl || `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&deposit_id=${deposit.id}`,
        cancel_url: cancelUrl || `${baseUrl}/booking/cancel?deposit_id=${deposit.id}`,
        metadata: {
          leadId: lead.id,
          depositId: deposit.id,
        },
      });

      await storage.updateDeposit(deposit.id, {
        stripeCheckoutSessionId: session.id,
      });

      res.json({ 
        checkoutUrl: session.url,
        sessionId: session.id,
        depositId: deposit.id,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.get("/api/deposits/verify/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        const depositId = session.metadata?.depositId;
        const leadId = session.metadata?.leadId;
        if (depositId) {
          await storage.updateDeposit(depositId, {
            status: "captured",
            stripePaymentIntentId: session.payment_intent as string,
            depositDate: new Date(),
          });
        }
        
        if (leadId) {
          const lead = await storage.getLead(leadId);
          if (lead?.contactEmail) {
            EmailService.sendDepositConfirmation(
              lead.contactEmail,
              lead.contactName,
              5000
            );
          }
        }
        
        res.json({ 
          success: true, 
          status: "paid",
          depositId,
        });
      } else {
        res.json({ 
          success: false, 
          status: session.payment_status,
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.post("/api/admin/deposits/:id/refund", requireAuth, async (req, res) => {
    try {
      const deposit = await storage.getDeposit(req.params.id);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }

      if (deposit.status === "refunded") {
        return res.status(400).json({ error: "Deposit already refunded" });
      }

      if (!deposit.stripePaymentIntentId) {
        return res.status(400).json({ error: "No payment intent to refund" });
      }

      const stripe = await getUncachableStripeClient();
      const refund = await stripe.refunds.create({
        payment_intent: deposit.stripePaymentIntentId,
      });

      await storage.updateDeposit(req.params.id, {
        status: "refunded",
        stripeRefundId: refund.id,
        refundedAt: new Date(),
        refundedBy: req.session.adminId,
      });

      if (deposit.leadId) {
        const lead = await storage.getLead(deposit.leadId);
        if (lead?.contactEmail) {
          EmailService.sendRefundNotification(
            lead.contactEmail,
            lead.contactName,
            deposit.amount
          );
        }
      }

      res.json({ success: true, refundId: refund.id });
    } catch (error) {
      console.error("Refund error:", error);
      res.status(500).json({ error: "Failed to process refund" });
    }
  });

  app.get("/api/admin/clients", requireAuth, async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/admin/clients/:id", requireAuth, async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.get("/api/admin/clients/:id/work-orders", requireAuth, async (req, res) => {
    try {
      const workOrders = await storage.getWorkOrdersByClientId(req.params.id);
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client work orders" });
    }
  });

  app.post("/api/admin/clients", requireAuth, async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/admin/clients/:id", requireAuth, async (req, res) => {
    try {
      const data = updateClientSchema.parse(req.body);
      const client = await storage.updateClient(req.params.id, data);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/admin/clients/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  app.post("/api/admin/leads/:id/convert", requireAuth, async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      if (lead.status === "converted") {
        return res.status(400).json({ error: "Lead already converted" });
      }

      const existingClient = await storage.getClientByLeadId(lead.id);
      if (existingClient) {
        return res.status(400).json({ error: "Client already exists for this lead" });
      }

      const deposit = await storage.getDepositByLeadId(lead.id);

      const client = await storage.createClient({
        leadId: lead.id,
        name: lead.contactName,
        email: lead.contactEmail,
        phone: lead.contactPhone || null,
        address: lead.address || null,
        stripeCustomerId: lead.stripeCustomerId || null,
        status: "active",
      });

      const { invoiceTotal, scheduledDate, timeWindow, scopeOfWork } = req.body;
      const depositAmount = deposit?.status === "captured" ? deposit.amount : 0;
      const remainingBalance = (invoiceTotal || 0) - depositAmount;

      const workOrder = await storage.createWorkOrder({
        leadId: lead.id,
        clientId: client.id,
        customerName: lead.contactName,
        customerEmail: lead.contactEmail,
        customerPhone: lead.contactPhone || null,
        address: lead.address || "",
        serviceTier: lead.serviceTier || null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        timeWindow: timeWindow || null,
        scopeOfWork: scopeOfWork || null,
        invoiceTotal: invoiceTotal || null,
        depositApplied: depositAmount > 0,
        depositAmount: depositAmount || null,
        remainingBalance: remainingBalance > 0 ? remainingBalance : null,
        status: scheduledDate ? "scheduled" : "new",
      });

      await storage.updateLead(lead.id, { status: "converted" });

      EmailService.sendLeadConvertedToClient(lead.contactEmail, lead.contactName);

      res.status(201).json({ 
        success: true, 
        client, 
        workOrder,
        depositApplied: depositAmount,
        remainingBalance,
      });
    } catch (error) {
      console.error("Lead conversion error:", error);
      res.status(500).json({ error: "Failed to convert lead" });
    }
  });

  app.post("/api/admin/work-orders/:id/complete", requireAuth, async (req, res) => {
    try {
      const workOrder = await storage.getWorkOrder(req.params.id);
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }

      const { invoiceTotal, completionNotes } = req.body;
      const depositAmount = workOrder.depositAmount || 0;
      const total = invoiceTotal || workOrder.invoiceTotal || 0;
      const remainingBalance = total - depositAmount;

      const updated = await storage.updateWorkOrder(req.params.id, {
        status: "completed",
        invoiceTotal: total,
        depositApplied: depositAmount > 0,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
        completionNotes: completionNotes || workOrder.completionNotes,
      });

      if (workOrder.clientId) {
        const client = await storage.getClient(workOrder.clientId);
        if (client) {
          await storage.updateClient(workOrder.clientId, {
            totalJobsCompleted: (client.totalJobsCompleted || 0) + 1,
          });
        }
      }

      if (workOrder.customerEmail) {
        EmailService.sendJobCompletedNotification(
          workOrder.customerEmail,
          workOrder.customerName,
          total,
          depositAmount,
          remainingBalance > 0 ? remainingBalance : 0
        );
      }

      res.json({ 
        success: true, 
        workOrder: updated,
        invoiceTotal: total,
        depositApplied: depositAmount,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
      });
    } catch (error) {
      console.error("Work order completion error:", error);
      res.status(500).json({ error: "Failed to complete work order" });
    }
  });

  app.post("/api/admin/work-orders/:id/charge-balance", requireAuth, async (req, res) => {
    try {
      const workOrder = await storage.getWorkOrder(req.params.id);
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }

      const remainingBalance = workOrder.remainingBalance || 0;
      if (remainingBalance <= 0) {
        return res.status(400).json({ error: "No remaining balance to charge" });
      }

      if (!workOrder.leadId) {
        return res.status(400).json({ error: "Work order has no associated lead" });
      }

      const lead = await storage.getLead(workOrder.leadId);
      if (!lead?.stripeCustomerId) {
        return res.status(400).json({ error: "Customer has no payment method on file" });
      }

      const stripe = await getUncachableStripeClient();

      const paymentMethods = await stripe.paymentMethods.list({
        customer: lead.stripeCustomerId,
        type: "card",
      });

      if (!paymentMethods.data.length) {
        return res.status(400).json({ error: "Customer has no saved payment method" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: remainingBalance,
        currency: "usd",
        customer: lead.stripeCustomerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
        description: `Remaining balance - Work Order #${workOrder.id}`,
        metadata: {
          workOrderId: workOrder.id,
          leadId: lead.id,
          type: "remaining_balance",
        },
      });

      await storage.updateWorkOrder(req.params.id, {
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: paymentIntent.latest_charge as string,
        paidAt: new Date(),
        remainingBalance: 0,
        status: "invoiced",
      });

      if (workOrder.clientId) {
        const client = await storage.getClient(workOrder.clientId);
        if (client) {
          await storage.updateClient(workOrder.clientId, {
            totalRevenue: (client.totalRevenue || 0) + remainingBalance,
          });
        }
      }

      if (workOrder.customerEmail) {
        EmailService.sendPaymentReceived(
          workOrder.customerEmail,
          workOrder.customerName,
          remainingBalance
        );
      }

      res.json({ 
        success: true, 
        paymentIntentId: paymentIntent.id,
        amount: remainingBalance,
      });
    } catch (error: any) {
      console.error("Charge balance error:", error);
      if (error.type === "StripeCardError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to charge remaining balance" });
    }
  });

  app.post("/api/admin/work-orders/:id/charge", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 100) {
        return res.status(400).json({ error: "Amount must be at least $1.00" });
      }

      const workOrder = await storage.getWorkOrder(req.params.id);
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }

      if (!workOrder.leadId) {
        return res.status(400).json({ error: "Work order has no associated lead" });
      }

      const lead = await storage.getLead(workOrder.leadId);
      if (!lead?.stripeCustomerId) {
        return res.status(400).json({ error: "Customer has no payment method on file" });
      }

      const stripe = await getUncachableStripeClient();

      const paymentMethods = await stripe.paymentMethods.list({
        customer: lead.stripeCustomerId,
        type: "card",
      });

      if (!paymentMethods.data.length) {
        return res.status(400).json({ error: "Customer has no saved payment method" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: lead.stripeCustomerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
        description: `Glass cleaning service - Work Order #${workOrder.id}`,
        metadata: {
          workOrderId: workOrder.id,
          leadId: lead.id,
        },
      });

      await storage.updateWorkOrder(req.params.id, {
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: paymentIntent.latest_charge as string,
        paidAt: new Date(),
        invoiceTotal: amount,
      });

      res.json({ 
        success: true, 
        paymentIntentId: paymentIntent.id,
        amount,
      });
    } catch (error: any) {
      console.error("Charge error:", error);
      if (error.type === "StripeCardError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to process charge" });
    }
  });

  return httpServer;
}
