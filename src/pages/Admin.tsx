import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Check, X, Landmark, User, CreditCard, Save, Lock, Eye, EyeOff, Users, Wallet, Receipt, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface WithdrawalRequest {
  id: string;
  userName: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface PaymentRequest {
  id: string;
  userName: string;
  phone: string;
  plan: string;
  amount: number;
  receipt: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}
const ADMIN_PIN = "258025";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // Payment account details
  const [paymentAccNumber, setPaymentAccNumber] = useState(() =>
    localStorage.getItem("admin_payment_acc_number") || "8142355686"
  );
  const [paymentAccName, setPaymentAccName] = useState(() =>
    localStorage.getItem("admin_payment_acc_name") || "YILKWAM MANCIT"
  );
  const [paymentBank, setPaymentBank] = useState(() =>
    localStorage.getItem("admin_payment_bank") || "MOMO PSB"
  );

  useEffect(() => {
    const saved = localStorage.getItem("withdrawal_requests");
    if (saved) setWithdrawalRequests(JSON.parse(saved));
    const payments = localStorage.getItem("payment_requests");
    if (payments) setPaymentRequests(JSON.parse(payments));
    const users = localStorage.getItem("registered_users");
    if (users) setRegisteredUsers(JSON.parse(users));
  }, []);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      toast({ title: "✅ Access Granted", description: "Welcome, Admin.", duration: 2000, className: "bg-card text-foreground border-primary/30 rounded-xl" });
    } else {
      toast({ title: "❌ Invalid PIN", description: "Please enter the correct admin PIN.", duration: 3000, className: "bg-card text-foreground border-destructive/30 rounded-xl" });
    }
  };

  const handleApprove = (id: string) => {
    const updated = withdrawalRequests.map(r =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    setWithdrawalRequests(updated);
    localStorage.setItem("withdrawal_requests", JSON.stringify(updated));

    // Deduct from wallet and add to transactions
    const req = withdrawalRequests.find(r => r.id === id);
    if (req) {
      const currentBalance = parseFloat(localStorage.getItem("wallet_balance") || "0");
      const newBalance = Math.max(0, currentBalance - req.amount);
      localStorage.setItem("wallet_balance", newBalance.toString());

      const newTx = {
        type: "Withdrawal",
        amount: req.amount,
        date: new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        status: "Completed",
      };
      const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
      localStorage.setItem("transactions", JSON.stringify([newTx, ...existing]));
    }

    toast({ title: "✅ Approved", description: "Withdrawal has been approved and processed.", duration: 3000, className: "bg-card text-foreground border-primary/30 rounded-xl" });
  };

  const handleReject = (id: string) => {
    const updated = withdrawalRequests.map(r =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    setWithdrawalRequests(updated);
    localStorage.setItem("withdrawal_requests", JSON.stringify(updated));
    toast({ title: "❌ Rejected", description: "Withdrawal request has been rejected.", duration: 3000, className: "bg-card text-foreground border-destructive/30 rounded-xl" });
  };

  const handleApprovePayment = (id: string) => {
    const updated = paymentRequests.map(r =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    setPaymentRequests(updated);
    localStorage.setItem("payment_requests", JSON.stringify(updated));

    // Activate the user's miner
    const req = paymentRequests.find(r => r.id === id);
    if (req) {
      localStorage.setItem("miner_activated", "true");
      localStorage.setItem("activation_date", new Date().toISOString());
    }

    toast({ title: "✅ Payment Approved", description: "User's miner has been activated.", duration: 3000, className: "bg-card text-foreground border-primary/30 rounded-xl" });
  };

  const handleRejectPayment = (id: string) => {
    const updated = paymentRequests.map(r =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    setPaymentRequests(updated);
    localStorage.setItem("payment_requests", JSON.stringify(updated));
    toast({ title: "❌ Payment Rejected", description: "Payment has been rejected.", duration: 3000, className: "bg-card text-foreground border-destructive/30 rounded-xl" });
  };

  const handleSavePaymentDetails = () => {
    localStorage.setItem("admin_payment_acc_number", paymentAccNumber);
    localStorage.setItem("admin_payment_acc_name", paymentAccName);
    localStorage.setItem("admin_payment_bank", paymentBank);
    toast({ title: "✅ Saved", description: "Payment account details updated.", duration: 3000, className: "bg-card text-foreground border-primary/30 rounded-xl" });
  };

  const pendingCount = withdrawalRequests.filter(r => r.status === "pending").length;
  const pendingPayments = paymentRequests.filter(r => r.status === "pending").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm border-border">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-lg text-foreground">Admin Access</CardTitle>
            <p className="text-xs text-muted-foreground">Enter your admin PIN to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-12 rounded-xl border-2 border-border bg-card text-foreground text-center text-lg tracking-[0.5em] focus:border-primary"
                maxLength={8}
              />
              <button
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleLogin} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Manage withdrawals & settings</p>
        </div>
        <Badge variant="outline" className="border-primary text-primary">
          {pendingCount + pendingPayments} pending
        </Badge>
      </div>

      <Tabs defaultValue="withdrawals" className="w-full">
        <TabsList className="w-full bg-card border border-border rounded-xl mb-4">
          <TabsTrigger value="withdrawals" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-3">
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-16">
              <ShieldCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No withdrawal requests yet</p>
            </div>
          ) : (
            withdrawalRequests.map((req) => (
              <Card key={req.id} className="border-border overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{req.userName}</p>
                      <p className="text-[10px] text-muted-foreground">{req.date}</p>
                    </div>
                    <Badge className={`text-[10px] ${
                      req.status === "pending" ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" :
                      req.status === "approved" ? "bg-primary/15 text-primary border-primary/30" :
                      "bg-destructive/15 text-destructive border-destructive/30"
                    }`}>
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-3 text-xs text-muted-foreground">
                    <p><span className="text-foreground font-medium">Amount:</span> ₦{req.amount.toLocaleString()}</p>
                    <p><span className="text-foreground font-medium">Account:</span> {req.accountName}</p>
                    <p><span className="text-foreground font-medium">Number:</span> {req.accountNumber}</p>
                    <p><span className="text-foreground font-medium">Bank:</span> {req.bankName}</p>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(req.id)}
                        size="sm"
                        className="flex-1 h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(req.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9 border-destructive text-destructive hover:bg-destructive/5 text-xs font-semibold rounded-lg"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-3">
          {registeredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No registered users yet</p>
            </div>
          ) : (
            registeredUsers.map((user, idx) => {
              const userWithdrawals = withdrawalRequests.filter(r => r.accountNumber === user.accountNumber);
              const totalWithdrawn = userWithdrawals.filter(r => r.status === "approved").reduce((sum, r) => sum + r.amount, 0);
              const pendingWithdrawals = userWithdrawals.filter(r => r.status === "pending").length;
              return (
                <Card key={idx} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{user.accountName}</p>
                          <p className="text-[10px] text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {user.accountNumber}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Total Withdrawn</p>
                        <p className="text-xs font-bold text-foreground">₦{totalWithdrawn.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Pending</p>
                        <p className="text-xs font-bold text-foreground">{pendingWithdrawals} request{pendingWithdrawals !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Joined: {new Date(user.registeredAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" />
                Receiving Account Details
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">This is the account shown to users on the payment page.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Account Number"
                  value={paymentAccNumber}
                  onChange={(e) => setPaymentAccNumber(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Account Name"
                  value={paymentAccName}
                  onChange={(e) => setPaymentAccName(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary"
                />
              </div>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Bank Name"
                  value={paymentBank}
                  onChange={(e) => setPaymentBank(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary"
                />
              </div>
              <Button
                onClick={handleSavePaymentDetails}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
