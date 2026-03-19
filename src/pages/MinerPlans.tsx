import { ArrowLeft, Check, Crown, Zap, Rocket, Star, Shield, ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MinerComparisonTable from "@/components/MinerComparisonTable";

const PLAN_PRICES: Record<string, number> = {
  basic: 5700,
  silver: 15000,
  gold: 45000,
  platinum: 100000,
};

const plans = [
  {
    id: "basic",
    name: "Basic Miner",
    icon: Zap,
    price: 5700,
    dailyLimit: "₦86,000",
    dailyAmount: 86000,
    minesPerDay: 1,
    features: [
      "1 mine per day",
      "₦86,000 daily limit",
      "Basic hash rate",
      "Standard support",
    ],
    badge: null,
  },
  {
    id: "silver",
    name: "Silver Miner",
    icon: Star,
    price: 15000,
    dailyLimit: "₦250,000",
    dailyAmount: 250000,
    minesPerDay: 3,
    features: [
      "3 mines per day",
      "₦250,000 daily limit",
      "Enhanced hash rate",
      "Priority support",
      "Mining analytics",
    ],
    badge: null,
  },
  {
    id: "gold",
    name: "Gold Miner",
    icon: Crown,
    price: 45000,
    dailyLimit: "₦750,000",
    dailyAmount: 750000,
    minesPerDay: 5,
    features: [
      "5 mines per day",
      "₦750,000 daily limit",
      "Boosted hash rate (3x)",
      "24/7 VIP support",
      "Advanced analytics",
    ],
    badge: "Popular",
  },
  {
    id: "platinum",
    name: "Platinum Miner",
    icon: Rocket,
    price: 100000,
    dailyLimit: "₦2,000,000",
    dailyAmount: 2000000,
    minesPerDay: 10,
    features: [
      "10 mines per day",
      "₦2,000,000 daily limit",
      "Maximum hash rate (10x)",
      "Dedicated account manager",
      "Full analytics suite",
      "Instant withdrawals",
    ],
    badge: "Best Value",
  },
];

const planOrder = ["basic", "silver", "gold", "platinum"];

const MinerPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<typeof plans[0] | null>(null);

  const currentPlanId = localStorage.getItem("selected_miner_plan") || "basic";
  const currentPlanPrice = PLAN_PRICES[currentPlanId] || 5700;
  const currentPlanIndex = planOrder.indexOf(currentPlanId);
  const isMinerActivated = localStorage.getItem("miner_activated") === "true";

  const getUpgradeCost = (targetPrice: number) => {
    return Math.max(0, targetPrice - currentPlanPrice);
  };

  const handleUpgrade = (plan: typeof plans[0]) => {
    if (!isMinerActivated) {
      toast({
        title: "🔒 Miner Not Activated",
        description: "You need to purchase and activate a miner first.",
        duration: 3000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      navigate("/buy-code");
      return;
    }
    setUpgradePlan(plan);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = () => {
    if (!upgradePlan) return;
    // Save upgraded plan
    localStorage.setItem("selected_miner_plan", upgradePlan.id);
    setShowUpgradeDialog(false);
    toast({
      title: "🎉 Plan Upgraded!",
      description: `You've upgraded to ${upgradePlan.name}. You now earn ${upgradePlan.dailyLimit} per mine.`,
      duration: 5000,
      className: "bg-card text-foreground border-primary/30 rounded-xl",
    });
    navigate("/payment-confirmation", {
      state: {
        accountNumber: localStorage.getItem("user_account_number") || "",
        accountName: localStorage.getItem("user_account_name") || "",
        bankName: localStorage.getItem("user_bank_name") || "",
        plan: { ...upgradePlan, price: getUpgradeCost(upgradePlan.price) },
        isUpgrade: true,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Upgrade Miner</h1>
          <p className="text-xs text-muted-foreground">Pay only the difference to upgrade</p>
        </div>
      </div>

      {/* Current Plan Info */}
      <div className="flex items-center justify-between mb-5 px-3.5 py-3 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Plan</p>
            <p className="text-sm font-bold text-foreground capitalize">{currentPlanId} Miner</p>
          </div>
        </div>
        <p className="text-sm font-bold text-primary">₦{currentPlanPrice.toLocaleString()}</p>
      </div>

      {/* ROI Comparison */}
      <MinerComparisonTable />

      {/* Plans */}
      <div className="space-y-3 pb-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const planIndex = planOrder.indexOf(plan.id);
          const isCurrentPlan = plan.id === currentPlanId;
          const isLowerPlan = planIndex <= currentPlanIndex && !isCurrentPlan;
          const upgradeCost = getUpgradeCost(plan.price);

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-200 ${
                isCurrentPlan
                  ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                  : isLowerPlan
                  ? "opacity-50 border-border"
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

              {isCurrentPlan && (
                <div className="absolute top-0 left-0">
                  <Badge className="rounded-none rounded-br-lg text-[9px] bg-accent text-accent-foreground border-none px-2 py-0.5">
                    Active
                  </Badge>
                </div>
              )}

              <CardContent className="p-3.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {plan.dailyLimit}/day · {plan.minesPerDay}x mines
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">₦{plan.price.toLocaleString()}</p>
                    {!isCurrentPlan && !isLowerPlan && isMinerActivated && (
                      <p className="text-[10px] text-primary font-semibold">
                        Upgrade: ₦{upgradeCost.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-[10px] text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrentPlan || isLowerPlan}
                  className={`w-full h-10 rounded-xl text-xs font-semibold ${
                    isCurrentPlan
                      ? "bg-muted text-muted-foreground"
                      : isLowerPlan
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : isLowerPlan ? (
                    "Lower Tier"
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="w-3.5 h-3.5" />
                      Upgrade for ₦{upgradeCost.toLocaleString()}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card rounded-2xl shadow-lg max-w-sm mx-auto border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              Confirm Upgrade
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-left pt-3 leading-relaxed text-sm space-y-3">
              {upgradePlan && (
                <>
                  <p>
                    Upgrade from <span className="text-foreground font-semibold capitalize">{currentPlanId} Miner</span> to{" "}
                    <span className="text-primary font-semibold">{upgradePlan.name}</span>.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">New plan price</span>
                      <span className="text-foreground font-medium">₦{upgradePlan.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Current plan credit</span>
                      <span className="text-foreground font-medium">-₦{currentPlanPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-semibold">You pay</span>
                      <span className="text-primary font-bold">₦{getUpgradeCost(upgradePlan.price).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs">
                    Your daily earnings will increase to <span className="text-primary font-semibold">{upgradePlan.dailyLimit}</span> with{" "}
                    <span className="text-primary font-semibold">{upgradePlan.minesPerDay}x</span> mines per day.
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)} className="text-muted-foreground">
              Cancel
            </Button>
            <Button onClick={confirmUpgrade} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
              <ArrowUp className="w-4 h-4 mr-1" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MinerPlans;