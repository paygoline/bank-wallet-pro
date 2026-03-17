import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BuyCode = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceed = () => {
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      toast({
        title: "⚠️ Missing Details",
        description: "Please fill in all account details before proceeding.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }
    navigate("/payment-confirmation", {
      state: { accountNumber, accountName, bankName },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Buy Miner</h1>
          <p className="text-xs text-muted-foreground">₦5,700 one-time activation</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Activate Your Miner</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Input your bank account details below. You'll be directed to make a one-time payment of ₦5,700 to activate your miner and start earning.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Bank Details</p>

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

      <Button
        onClick={handleProceed}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl"
      >
        PROCEED TO PAYMENT
      </Button>
    </div>
  );
};

export default BuyCode;
