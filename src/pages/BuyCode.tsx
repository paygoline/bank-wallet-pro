import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CreditCard, Landmark, ShieldCheck, Zap, Star, Crown, Rocket, Check, Info, Pickaxe, ExternalLink, Loader2 } from "lucide-react";
import ProfessionalLoader from "@/components/ProfessionalLoader";
import { useToast } from "@/hooks/use-toast";
import { nigerianBanks } from "@/data/nigerianBanks";
import MinerComparisonTable from "@/components/MinerComparisonTable";

const minerPlans = [
  {
    id: "basic",
    name: "Basic Miner",
    icon: Zap,
    price: 5700,
    dailyEarning: "₦86,000",
    minesPerDay: 1,
    features: ["1 mine per day", "₦86,000 daily earning", "Basic hash rate", "Standard withdrawals"],
    badge: null,
    popular: false,
  },
  {
    id: "silver",
    name: "Silver Miner",
    icon: Star,
    price: 15000,
    dailyEarning: "₦250,000",
    minesPerDay: 3,
    features: ["3 mines per day", "₦250,000 daily earning", "Enhanced hash rate", "Priority support"],
    badge: null,
    popular: false,
  },
  {
    id: "gold",
    name: "Gold Miner",
    icon: Crown,
    price: 45000,
    dailyEarning: "₦750,000",
    minesPerDay: 5,
    features: ["5 mines per day", "₦750,000 daily earning", "3x boosted hash rate", "VIP support"],
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum Miner",
    icon: Rocket,
    price: 100000,
    dailyEarning: "₦2,000,000",
    minesPerDay: 10,
    features: ["10 mines per day", "₦2,000,000 daily earning", "10x max hash rate", "Instant withdrawals"],
    badge: "Best Value",
    popular: false,
  },
];

const BuyCode = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const selected = minerPlans.find((p) => p.id === selectedPlan);

  const handleProceed = () => {
    if (!selectedPlan) {
      toast({
        title: "⚠️ Select a Miner",
        description: "Please choose a miner plan before proceeding.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      toast({
        title: "⚠️ Missing Details",
        description: "Please fill in all your bank account details.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      return;
    }
    
    setIsLoading(true);
    localStorage.setItem("selected_miner_plan", selectedPlan);
    localStorage.setItem("selected_miner_price", selected?.price.toString() || "5700");
    localStorage.setItem("user_account_name", accountName);
    localStorage.setItem("user_account_number", accountNumber);
    localStorage.setItem("user_bank_name", bankName);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/payment-confirmation", {
        state: { accountNumber, accountName, bankName, plan: selected },
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-6">
      {isLoading && (
        <ProfessionalLoader fullScreen overlay showText text="Preparing payment details..." />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Purchase Miner</h1>
          <p className="text-xs text-muted-foreground">Select a plan & activate your miner</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3.5 mb-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-foreground font-semibold mb-0.5">How it works</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Choose your miner plan below, fill in your bank details for withdrawals, then make a one-time payment to activate. Once activated, you can mine daily and withdraw earnings to your bank.
          </p>
        </div>
      </div>

      {/* ROI Comparison Table */}
      <MinerComparisonTable />

      {/* Miner Plans */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Pickaxe className="w-3.5 h-3.5" />
          Choose Your Miner
        </p>
        <div className="space-y-3">
          {minerPlans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg text-[9px] bg-primary text-primary-foreground border-none px-2 py-0.5">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Selection indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                        <p className="text-[10px] text-muted-foreground">
                          {plan.dailyEarning}/day · {plan.minesPerDay}x mines
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-primary">₦{plan.price.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground">one-time</p>
                    </div>
                  </div>

                  {/* Expandable features when selected */}
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-1.5">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-[10px] text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bank Details Form */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your Bank Details
        </p>
        <p className="text-[11px] text-muted-foreground -mt-1">
          Enter the bank account where your mining earnings will be sent.
        </p>

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
          <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Select value={bankName} onValueChange={(val) => setBankName(val)}>
            <SelectTrigger className="h-12 pl-10 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary [&>span]:text-left">
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {nigerianBanks.map((bank) => (
                <SelectItem key={bank} value={bank} className="text-sm">
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary & Proceed */}
      {selected && (
        <div className="bg-card border border-border rounded-xl p-3.5 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Selected Plan</p>
            <p className="text-sm font-bold text-foreground">{selected.name}</p>
          </div>
          <p className="text-lg font-bold text-primary">₦{selected.price.toLocaleString()}</p>
        </div>
      )}

      {/* Payment Link Gateway Option */}
      {selected && (
        <div className="bg-card border border-border rounded-xl p-3.5 mb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Payment Options</p>
          <div className="flex gap-2">
            <Button
              onClick={handleProceed}
              disabled={isLoading}
              className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bank Transfer"}
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("selected_miner_plan", selectedPlan!);
                localStorage.setItem("selected_miner_price", selected.price.toString());
                window.open(`https://paystack.com/pay/miner-${selected.id}`, "_blank");
              }}
              variant="outline"
              className="flex-1 h-11 font-bold text-sm rounded-xl border-primary text-primary hover:bg-primary/5"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Pay Online
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mt-4 pb-4">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-muted-foreground">Secure Payment</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-muted-foreground">Instant Activation</span>
        </div>
      </div>
    </div>
  );
};

export default BuyCode;
