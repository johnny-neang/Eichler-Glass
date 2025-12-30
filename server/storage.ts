import { 
  type AdminUser,
  type Lead, type InsertLead,
  type Deposit, type InsertDeposit,
  type WorkOrder, type InsertWorkOrder,
  adminUsers, leads, deposits, workOrders
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  updateAdminLastLogin(id: string): Promise<void>;
  
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  
  getDeposits(): Promise<Deposit[]>;
  getDeposit(id: string): Promise<Deposit | undefined>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  updateDeposit(id: string, data: Partial<InsertDeposit>): Promise<Deposit | undefined>;
  
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrder(id: string): Promise<WorkOrder | undefined>;
  createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: string, data: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined>;
  deleteWorkOrder(id: string): Promise<boolean>;
  
  getDashboardStats(): Promise<{
    totalLeads: number;
    newLeads: number;
    totalDeposits: number;
    pendingDeposits: number;
    totalWorkOrders: number;
    scheduledWorkOrders: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, id));
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    await db.delete(deposits).where(eq(deposits.leadId, id));
    await db.delete(workOrders).where(eq(workOrders.leadId, id));
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  async getDeposits(): Promise<Deposit[]> {
    return db.select().from(deposits).orderBy(desc(deposits.createdAt));
  }

  async getDeposit(id: string): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id));
    return deposit;
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const [newDeposit] = await db.insert(deposits).values(deposit).returning();
    return newDeposit;
  }

  async updateDeposit(id: string, data: Partial<InsertDeposit>): Promise<Deposit | undefined> {
    const [updated] = await db.update(deposits).set(data).where(eq(deposits.id, id)).returning();
    return updated;
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    return db.select().from(workOrders).orderBy(desc(workOrders.createdAt));
  }

  async getWorkOrder(id: string): Promise<WorkOrder | undefined> {
    const [workOrder] = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return workOrder;
  }

  async createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder> {
    const [newWorkOrder] = await db.insert(workOrders).values(workOrder).returning();
    return newWorkOrder;
  }

  async updateWorkOrder(id: string, data: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined> {
    const [updated] = await db.update(workOrders).set({ ...data, updatedAt: new Date() }).where(eq(workOrders.id, id)).returning();
    return updated;
  }

  async deleteWorkOrder(id: string): Promise<boolean> {
    const result = await db.delete(workOrders).where(eq(workOrders.id, id)).returning();
    return result.length > 0;
  }

  async getDashboardStats() {
    const [leadStats] = await db.select({
      total: sql<number>`count(*)::int`,
      newCount: sql<number>`count(*) filter (where ${leads.status} = 'new')::int`,
    }).from(leads);

    const [depositStats] = await db.select({
      total: sql<number>`count(*)::int`,
      pendingCount: sql<number>`count(*) filter (where ${deposits.status} = 'pending')::int`,
    }).from(deposits);

    const [workOrderStats] = await db.select({
      total: sql<number>`count(*)::int`,
      scheduledCount: sql<number>`count(*) filter (where ${workOrders.status} = 'scheduled')::int`,
    }).from(workOrders);

    return {
      totalLeads: leadStats?.total || 0,
      newLeads: leadStats?.newCount || 0,
      totalDeposits: depositStats?.total || 0,
      pendingDeposits: depositStats?.pendingCount || 0,
      totalWorkOrders: workOrderStats?.total || 0,
      scheduledWorkOrders: workOrderStats?.scheduledCount || 0,
    };
  }
}

export const storage = new DatabaseStorage();
