import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Phone, Mail, MapPin, Calendar, Download } from "lucide-react";
import type { Lead } from "@shared/schema";

export default function AdminLeads() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAuthenticated = !!token;

  const { data: leads, isLoading, error } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const response = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          setToken("");
          localStorage.removeItem("admin_token");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch leads");
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid password");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  const exportCSV = () => {
    if (!leads?.length) return;

    const headers = [
      "ID", "Date", "First Name", "Last Name", "Email", "Phone",
      "Location", "Property Type", "Services", "Frequency",
      "Street", "City", "State", "ZIP", "Referral Source", "Promo Code"
    ];

    const rows = leads.map(lead => [
      lead.id,
      new Date(lead.createdAt).toLocaleString(),
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.phone,
      lead.location,
      lead.propertyType,
      lead.services.join("; "),
      lead.frequency,
      lead.street,
      lead.city,
      lead.state,
      lead.zip,
      lead.referralSource || "",
      lead.promoCode || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  data-testid="input-admin-password"
                />
              </div>
              {loginError && (
                <p className="text-destructive text-sm">{loginError}</p>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoggingIn}
                data-testid="button-admin-login"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="font-serif text-xl font-bold">Lead Management</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportCSV}
              disabled={!leads?.length}
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load leads. Please try again.</p>
          </div>
        ) : !leads?.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No leads yet. They'll appear here when customers submit the booking form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} total
            </p>
            {leads.map((lead) => (
              <Card key={lead.id} data-testid={`card-lead-${lead.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </a>
                        <a 
                          href={`tel:${lead.phone}`} 
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(lead.createdAt).toLocaleDateString()} at{" "}
                      {new Date(lead.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">{lead.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Property Type</p>
                      <p className="font-medium">{lead.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Frequency</p>
                      <p className="font-medium">{lead.frequency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Referral</p>
                      <p className="font-medium">{lead.referralSource || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted-foreground text-sm mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.services.map((service: string) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>
                      {lead.street}, {lead.city}, {lead.state} {lead.zip}
                    </span>
                  </div>

                  {lead.promoCode && (
                    <div className="mt-4">
                      <Badge variant="outline">Promo: {lead.promoCode}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
