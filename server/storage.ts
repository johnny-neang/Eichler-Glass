import { db } from "./db";
import { leads, InsertLead, Lead } from "../shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }
}

export const storage = new DatabaseStorage();
