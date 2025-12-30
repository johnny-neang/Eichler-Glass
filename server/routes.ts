import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;
import { storage } from "./storage";
import { insertLeadSchema, insertDepositSchema, insertWorkOrderSchema, updateLeadSchema, updateDepositSchema, updateWorkOrderSchema } from "@shared/schema";
import { z } from "zod";

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

  return httpServer;
}
