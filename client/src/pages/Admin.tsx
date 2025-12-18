import { useState } from "react";
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
  LayoutDashboard, Users, MapPin, Settings, Search, Phone, Mail, 
  DollarSign, Calendar, Clock, ChevronRight, Plus, RefreshCcw, LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OpportunityStatus = "new_lead" | "deposit_received" | "contacted" | "scheduled" | "completed" | "canceled" | "refunded";

interface Opportunity {
  id: string;
  customer: { name: string; email: string; phone: string; address: string };
  citySlug: string;
  serviceTier: string;
  priceQuoted: number;
  depositAmount: number;
  status: OpportunityStatus;
  createdAt: string;
  notes: { text: string; createdAt: string }[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    customer: { name: "Sarah Mitchell", email: "sarah@email.com", phone: "(510) 555-1234", address: "456 Modern Ave, Walnut Creek" },
    citySlug: "walnut-creek",
    serviceTier: "interior-exterior",
    priceQuoted: 400,
    depositAmount: 50,
    status: "deposit_received",
    createdAt: "Dec 18, 2025",
    notes: [{ text: "Customer prefers morning appointments", createdAt: "Dec 18, 2025" }],
  },
  {
    id: "2",
    customer: { name: "Michael Chen", email: "mchen@email.com", phone: "(925) 555-5678", address: "789 Eichler Ln, Concord" },
    citySlug: "concord",
    serviceTier: "full-skylight",
    priceQuoted: 650,
    depositAmount: 50,
    status: "contacted",
    createdAt: "Dec 17, 2025",
    notes: [],
  },
  {
    id: "3",
    customer: { name: "Jennifer Lopez", email: "jlopez@email.com", phone: "(510) 555-9012", address: "321 Glass Dr, Castro Valley" },
    citySlug: "castro-valley",
    serviceTier: "interior",
    priceQuoted: 250,
    depositAmount: 50,
    status: "scheduled",
    createdAt: "Dec 16, 2025",
    notes: [{ text: "Scheduled for Dec 22 at 2pm", createdAt: "Dec 17, 2025" }],
  },
  {
    id: "4",
    customer: { name: "David Park", email: "dpark@email.com", phone: "(925) 555-3456", address: "654 Window St, Walnut Creek" },
    citySlug: "walnut-creek",
    serviceTier: "interior-exterior",
    priceQuoted: 400,
    depositAmount: 50,
    status: "completed",
    createdAt: "Dec 10, 2025",
    notes: [],
  },
];

const statusColors: Record<OpportunityStatus, string> = {
  new_lead: "bg-blue-500/10 text-blue-600 border-0",
  deposit_received: "bg-primary/10 text-primary border-0",
  contacted: "bg-yellow-500/10 text-yellow-600 border-0",
  scheduled: "bg-purple-500/10 text-purple-600 border-0",
  completed: "bg-green-500/10 text-green-600 border-0",
  canceled: "bg-red-500/10 text-red-600 border-0",
  refunded: "bg-gray-500/10 text-gray-600 border-0",
};

const statusLabels: Record<OpportunityStatus, string> = {
  new_lead: "New Lead",
  deposit_received: "Deposit Received",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
  refunded: "Refunded",
};

export default function Admin() {
  const { toast } = useToast();
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newNote, setNewNote] = useState("");

  const filteredOpps = mockOpportunities.filter((opp) => {
    const matchesSearch = 
      opp.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (oppId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Opportunity status changed to ${statusLabels[newStatus as OpportunityStatus]}`,
    });
    console.log("Status change:", oppId, newStatus);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      toast({
        title: "Note Added",
        description: "Your note has been saved.",
      });
      console.log("Add note:", newNote);
      setNewNote("");
    }
  };

  const handleRefund = (oppId: string) => {
    toast({
      title: "Refund Initiated",
      description: "The refund process has been started via Stripe.",
    });
    console.log("Refund:", oppId);
  };

  const stats = {
    pending: mockOpportunities.filter((o) => o.status === "deposit_received").length,
    scheduled: mockOpportunities.filter((o) => o.status === "scheduled").length,
    completed: mockOpportunities.filter((o) => o.status === "completed").length,
    revenue: mockOpportunities.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.priceQuoted, 0),
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r bg-sidebar p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">EG</span>
          </div>
          <span className="font-serif text-lg font-semibold">Admin</span>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-accent" data-testid="nav-dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" data-testid="nav-users">
            <Users className="h-4 w-4" />
            Users
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" data-testid="nav-cities">
            <MapPin className="h-4 w-4" />
            Cities
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" data-testid="nav-settings">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@eichlerglass.com</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between gap-4 px-6 bg-background">
          <h1 className="text-xl font-semibold" data-testid="text-admin-title">Opportunities</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" data-testid="button-admin-logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Deposit</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold">{stats.scheduled}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${stats.revenue}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <CardTitle>Pipeline</CardTitle>
                  <CardDescription>Manage customer opportunities</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-9 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-opps"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredOpps.map((opp) => (
                  <Dialog key={opp.id}>
                    <DialogTrigger asChild>
                      <div
                        className="flex items-center justify-between p-4 rounded-lg border hover-elevate cursor-pointer"
                        onClick={() => setSelectedOpp(opp)}
                        data-testid={`card-opp-${opp.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {opp.customer.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{opp.customer.name}</span>
                              <Badge className={statusColors[opp.status]}>
                                {statusLabels[opp.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {opp.serviceTier.replace("-", " + ")} - ${opp.priceQuoted}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{opp.createdAt}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          {opp.customer.name}
                          <Badge className={statusColors[opp.status]}>
                            {statusLabels[opp.status]}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Opportunity created on {opp.createdAt}
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="details" className="mt-4">
                        <TabsList>
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="notes">Notes ({opp.notes.length})</TabsTrigger>
                          <TabsTrigger value="actions">Actions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-4 mt-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {opp.customer.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {opp.customer.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {opp.customer.address}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Service</span>
                                <span className="font-medium">{opp.serviceTier.replace("-", " + ")}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quoted Price</span>
                                <span className="font-medium">${opp.priceQuoted}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Deposit</span>
                                <span className="font-medium">${opp.depositAmount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <label className="text-sm font-medium mb-2 block">Update Status</label>
                            <Select
                              value={opp.status}
                              onValueChange={(val) => handleStatusChange(opp.id, val)}
                            >
                              <SelectTrigger data-testid="select-update-status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusLabels).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>
                        <TabsContent value="notes" className="space-y-4 mt-4">
                          {opp.notes.length > 0 ? (
                            <div className="space-y-2">
                              {opp.notes.map((note, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-muted text-sm">
                                  <p>{note.text}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{note.createdAt}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No notes yet.</p>
                          )}
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Add a note..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              rows={2}
                              data-testid="textarea-add-note"
                            />
                          </div>
                          <Button onClick={handleAddNote} className="gap-2" data-testid="button-add-note">
                            <Plus className="h-4 w-4" />
                            Add Note
                          </Button>
                        </TabsContent>
                        <TabsContent value="actions" className="space-y-4 mt-4">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <Button variant="outline" className="gap-2" data-testid="button-call-customer">
                              <Phone className="h-4 w-4" />
                              Call Customer
                            </Button>
                            <Button variant="outline" className="gap-2" data-testid="button-email-customer">
                              <Mail className="h-4 w-4" />
                              Send Email
                            </Button>
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() => handleRefund(opp.id)}
                              data-testid="button-refund"
                            >
                              <RefreshCcw className="h-4 w-4" />
                              Refund Deposit
                            </Button>
                            <Button variant="outline" className="gap-2" data-testid="button-charge">
                              <DollarSign className="h-4 w-4" />
                              Charge Additional
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
