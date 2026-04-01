import { Send, ArrowLeft, Wallet, User, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProfessionalLoader from "@/components/ProfessionalLoader";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const walletBalance = parseFloat(localStorage.getItem("wallet_balance") || "0");
  const savedName = localStorage.getItem("user_account_name") || "";
  const savedNumber = localStorage.getItem("user_account_number") || "";

  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState(savedName);
  const [accountNumber, setAccountNumber] = useState(savedNumber);
  const [bankName, setBankName] = useState("");

  const handleWithdraw = () => {
    const withdrawAmt = parseFloat(amount);
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      toast({
        title: "⚠️ Missing Details",
        description: "Please fill in all account details before withdrawing.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }
    if (!amount || isNaN(withdrawAmt) || withdrawAmt <= 0) {
      toast({
        title: "⚠️ Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }
    if (withdrawAmt > walletBalance) {
      toast({
        title: "❌ Insufficient Balance",
        description: `Your wallet balance is ₦${walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }

    setIsLoading(true);

    // Create a pending withdrawal request for admin approval
    const newRequest = {
      id: Date.now().toString(),
      userName: accountName,
      accountName,
      accountNumber,
      bankName,
      amount: withdrawAmt,
      date: new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "pending" as const,
    };
    const existing = JSON.parse(localStorage.getItem("withdrawal_requests") || "[]");
    localStorage.setItem("withdrawal_requests", JSON.stringify([newRequest, ...existing]));

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "📤 Withdrawal Submitted",
        description: "Your withdrawal request is pending admin approval. You'll be notified once processed.",
        duration: 5000,
        className: "bg-card text-foreground border-primary/30 rounded-xl",
      });
      navigate("/dashboard");
    }, 3000);
  };

  const quickAmounts = [5000, 10000, 50000, walletBalance].filter(a => a > 0);

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6">
      {isLoading && (
        <ProfessionalLoader fullScreen overlay showText text="Processing withdrawal..." />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Withdraw Funds</h1>
      </div>

      {/* Balance Card */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <p className="text-xl font-bold text-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 mb-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount to Withdraw</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">₦</span>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-14 pl-10 rounded-xl border-2 border-border bg-card text-foreground text-lg font-semibold focus:border-primary"
          />
        </div>
        {/* Quick amounts */}
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((amt, i) => (
            <button
              key={i}
              onClick={() => setAmount(amt.toString())}
              className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {amt === walletBalance ? "MAX" : `₦${amt.toLocaleString()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bank Details</p>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="relative">
          <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      {/* Withdraw Button */}
      <Button
        onClick={handleWithdraw}
        disabled={isLoading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        Withdraw
      </Button>
    </div>
  );
};

export default Withdraw;
