import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, Users, FileText, DollarSign, Calendar, Clock, 
  Plus, LogOut, Mail, Phone, MapPin, Briefcase, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lead, Deposit, WorkOrder } from "@shared/schema";

type AdminTab = "dashboard" | "leads" | "deposits" | "work-orders";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalDeposits: number;
  pendingDeposits: number;
  totalWorkOrders: number;
  scheduledWorkOrders: number;
}

const leadStatusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  quoted: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  converted: "bg-green-500/10 text-green-600 dark:text-green-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const depositStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  captured: "bg-green-500/10 text-green-600 dark:text-green-400",
  refunded: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const workOrderStatusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  scheduled: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  in_progress: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  completed: "bg-green-500/10 text-green-600 dark:text-green-400",
  invoiced: "bg-primary/10 text-primary",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/auth/login", { username, password });
      return res.json();
    },
    onSuccess: () => {
      onLogin();
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Admin Login</CardTitle>
          <CardDescription>Eichler Glass Management Portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              data-testid="input-username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              data-testid="input-password"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => loginMutation.mutate()}
            disabled={loginMutation.isPending}
            data-testid="button-login"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardView({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
                <p className="text-xs text-muted-foreground">{stats.newLeads} new</p>
              </div>
              <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="text-2xl font-bold">{stats.totalDeposits}</p>
                <p className="text-xs text-muted-foreground">{stats.pendingDeposits} pending</p>
              </div>
              <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Work Orders</p>
                <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                <p className="text-xs text-muted-foreground">{stats.scheduledWorkOrders} scheduled</p>
              </div>
              <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LeadsView() {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/leads/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Lead Updated" });
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold">Leads</h2>
        <Badge variant="secondary">{leads.length} total</Badge>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No leads yet. Leads will appear here when customers submit the contact form.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <Dialog key={lead.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover-elevate" onClick={() => setSelectedLead(lead)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {lead.contactName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lead.contactName}</p>
                          <p className="text-sm text-muted-foreground">{lead.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={leadStatusColors[lead.status || "new"]}>{lead.status || "new"}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{lead.contactName}</DialogTitle>
                  <DialogDescription>Lead details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {lead.contactEmail}
                    </div>
                    {lead.contactPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {lead.contactPhone}
                      </div>
                    )}
                    {lead.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {lead.address}
                      </div>
                    )}
                  </div>
                  {lead.notes && (
                    <div className="p-3 bg-muted text-sm">
                      <p className="font-medium mb-1">Notes</p>
                      <p>{lead.notes}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                    <Select
                      value={lead.status || "new"}
                      onValueChange={(val) => updateMutation.mutate({ id: lead.id, status: val })}
                    >
                      <SelectTrigger data-testid="select-lead-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}

function DepositsView() {
  const { toast } = useToast();
  const [refundingDepositId, setRefundingDepositId] = useState<string | null>(null);
  const { data: deposits = [], isLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/admin/deposits"],
  });

  const refundMutation = useMutation({
    mutationFn: async (depositId: string) => {
      setRefundingDepositId(depositId);
      const res = await apiRequest("POST", `/api/admin/deposits/${depositId}/refund`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Refund Processed", description: "The deposit has been refunded successfully." });
      setRefundingDepositId(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Refund Failed", 
        description: error.message || "Failed to process refund.",
        variant: "destructive",
      });
      setRefundingDepositId(null);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading deposits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold">Deposits</h2>
        <Badge variant="secondary">{deposits.length} total</Badge>
      </div>

      {deposits.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No deposits yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {deposits.map((deposit) => (
            <Card key={deposit.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium">${(deposit.amount / 100).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{deposit.method}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={depositStatusColors[deposit.status || "pending"]}>{deposit.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {deposit.depositDate ? new Date(deposit.depositDate).toLocaleDateString() : ""}
                    </span>
                    {deposit.status === "captured" && deposit.stripePaymentIntentId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refundMutation.mutate(deposit.id)}
                        disabled={refundMutation.isPending}
                        data-testid={`button-refund-${deposit.id}`}
                      >
                        {refundMutation.isPending && refundingDepositId === deposit.id ? "Processing..." : "Refund"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkOrdersView() {
  const { toast } = useToast();
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargingOrderId, setChargingOrderId] = useState<string | null>(null);
  
  const { data: workOrders = [], isLoading } = useQuery<WorkOrder[]>({
    queryKey: ["/api/admin/work-orders"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/work-orders/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Work Order Updated" });
    },
  });

  const chargeMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const res = await apiRequest("POST", `/api/admin/work-orders/${id}/charge`, { amount });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-orders"] });
      toast({ 
        title: "Payment Processed", 
        description: `Charged $${(data.amount / 100).toFixed(2)} successfully.` 
      });
      setChargeAmount("");
      setChargingOrderId(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Payment Failed", 
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      });
    },
  });

  const handleCharge = (workOrderId: string) => {
    const amountInCents = Math.round(parseFloat(chargeAmount) * 100);
    if (isNaN(amountInCents) || amountInCents < 100) {
      toast({ 
        title: "Invalid Amount", 
        description: "Please enter an amount of at least $1.00.",
        variant: "destructive",
      });
      return;
    }
    chargeMutation.mutate({ id: workOrderId, amount: amountInCents });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading work orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold">Work Orders</h2>
        <Badge variant="secondary">{workOrders.length} total</Badge>
      </div>

      {workOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No work orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {workOrders.map((wo) => (
            <Dialog key={wo.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover-elevate">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-medium">{wo.customerName}</p>
                        <p className="text-sm text-muted-foreground">{wo.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={workOrderStatusColors[wo.status || "new"]}>{wo.status?.replace("_", " ")}</Badge>
                        {wo.scheduledDate && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(wo.scheduledDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{wo.customerName}</DialogTitle>
                  <DialogDescription>Work Order Details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {wo.address}
                    </div>
                    {wo.customerEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {wo.customerEmail}
                      </div>
                    )}
                    {wo.customerPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {wo.customerPhone}
                      </div>
                    )}
                    {wo.scheduledDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(wo.scheduledDate).toLocaleDateString()} {wo.timeWindow && `(${wo.timeWindow})`}
                      </div>
                    )}
                  </div>
                  {wo.scopeOfWork && (
                    <div className="p-3 bg-muted text-sm">
                      <p className="font-medium mb-1">Scope of Work</p>
                      <p>{wo.scopeOfWork}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                    <Select
                      value={wo.status || "new"}
                      onValueChange={(val) => updateMutation.mutate({ id: wo.id, status: val })}
                    >
                      <SelectTrigger data-testid="select-wo-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="invoiced">Invoiced</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {wo.paidAt ? (
                    <div className="p-3 bg-green-500/10 text-sm">
                      <p className="font-medium text-green-600 dark:text-green-400">
                        Paid: ${wo.invoiceTotal ? (wo.invoiceTotal / 100).toFixed(2) : "0.00"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(wo.paidAt).toLocaleString()}
                      </p>
                    </div>
                  ) : wo.leadId && (
                    <div className="space-y-2 pt-2 border-t">
                      <label className="text-sm font-medium block">Charge Customer</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="0.00"
                            className="pl-7"
                            value={chargingOrderId === wo.id ? chargeAmount : ""}
                            onChange={(e) => {
                              setChargingOrderId(wo.id);
                              setChargeAmount(e.target.value);
                            }}
                            data-testid={`input-charge-amount-${wo.id}`}
                          />
                        </div>
                        <Button
                          onClick={() => handleCharge(wo.id)}
                          disabled={chargeMutation.isPending || chargingOrderId !== wo.id || !chargeAmount}
                          data-testid={`button-charge-${wo.id}`}
                        >
                          {chargeMutation.isPending && chargingOrderId === wo.id ? "Processing..." : "Charge"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Customer will be charged using their saved payment method.
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const { data: authData, isLoading: authLoading, isError } = useQuery({
    queryKey: ["/api/admin/auth/me"],
    retry: false,
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
    enabled: isAuthenticated || !!authData,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      setIsAuthenticated(false);
      window.location.reload();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!authData && !isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "deposits", label: "Deposits", icon: DollarSign },
    { id: "work-orders", label: "Work Orders", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r bg-sidebar p-4 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">EG</span>
          </div>
          <span className="font-serif text-lg font-semibold">Admin</span>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start gap-2 ${activeTab === item.id ? "bg-accent" : ""}`}
              onClick={() => setActiveTab(item.id)}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => logoutMutation.mutate()}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between gap-4 px-6 bg-background">
          <div className="lg:hidden">
            <Select value={activeTab} onValueChange={(val) => setActiveTab(val as AdminTab)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {navItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <h1 className="text-xl font-semibold hidden lg:block" data-testid="text-admin-title">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
              className="lg:hidden"
              data-testid="button-admin-logout-mobile"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && stats && <DashboardView stats={stats} />}
          {activeTab === "leads" && <LeadsView />}
          {activeTab === "deposits" && <DepositsView />}
          {activeTab === "work-orders" && <WorkOrdersView />}
        </main>
      </div>
    </div>
  );
}
