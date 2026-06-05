import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage.js";
import { insertLeadSchema } from "../shared/schema.js";
import { sendLeadNotification } from "./email.js";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.warn("WARNING: ADMIN_PASSWORD not set. Admin routes will be inaccessible.");
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: "Admin not configured" });
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const token = authHeader.substring(7);
  
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<void> {
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      sendLeadNotification(lead).catch((err) => {
        console.error("Email notification failed:", err);
      });
      
      res.status(201).json({ success: true, id: lead.id });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.post("/api/admin/login", (req: Request, res: Response) => {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ error: "Admin not configured" });
    }
    
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
      res.json({ token: ADMIN_PASSWORD });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/leads", adminAuth, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });
}
