import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CreditCard, User, MapPin, Clock, DollarSign, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  address: string;
  status: "scheduled" | "completed" | "canceled";
  price: number;
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "refunded" | "pending";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "Dec 28, 2025",
    time: "10:00 AM",
    service: "Interior + Exterior",
    address: "123 Eichler Way, Castro Valley, CA",
    status: "scheduled",
    price: 400,
  },
  {
    id: "2",
    date: "Nov 15, 2025",
    time: "2:00 PM",
    service: "Interior",
    address: "123 Eichler Way, Castro Valley, CA",
    status: "completed",
    price: 250,
  },
];

const mockPayments: Payment[] = [
  {
    id: "1",
    date: "Dec 18, 2025",
    description: "Deposit - Interior + Exterior",
    amount: 50,
    status: "paid",
  },
  {
    id: "2",
    date: "Nov 15, 2025",
    description: "Full Payment - Interior",
    amount: 250,
    status: "paid",
  },
];

const mockUser = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "(510) 555-0123",
};

export default function Account() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(mockUser);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    console.log("Profile updated:", profile);
  };

  const handleLogout = () => {
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    console.log("Logout triggered");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-primary/10 text-primary border-0">Scheduled</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 border-0">Paid</Badge>;
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-serif text-2xl font-bold" data-testid="text-account-name">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments" className="gap-2" data-testid="tab-appointments">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2" data-testid="tab-payments">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Appointments</CardTitle>
                  <CardDescription>View and manage your scheduled services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex flex-wrap gap-4 items-start justify-between p-4 rounded-lg border"
                      data-testid={`card-appointment-${apt.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{apt.service}</h3>
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {apt.address}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${apt.price}</p>
                        {apt.status === "scheduled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => console.log("Cancel appointment:", apt.id)}
                            data-testid={`button-cancel-${apt.id}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Your deposits and payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      data-testid={`card-payment-${payment.id}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{payment.description}</h3>
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {payment.amount}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        data-testid="input-profile-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        data-testid="input-profile-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        data-testid="input-profile-phone"
                      />
                    </div>
                    <Button type="submit" className="rounded-full" data-testid="button-save-profile">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
