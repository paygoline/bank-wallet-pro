import { ArrowLeft, Check, Crown, Zap, Rocket, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free Miner",
    icon: Zap,
    price: "₦0",
    period: "Forever",
    dailyLimit: "₦86,000",
    dailyAmount: 86000,
    minesPerDay: 1,
    features: [
      "1 mine per day",
      "₦86,000 daily limit",
      "Basic hash rate",
      "Standard support",
    ],
    color: "border-border",
    badge: null,
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    id: "silver",
    name: "Silver Miner",
    icon: Star,
    price: "₦15,000",
    period: "/month",
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
    color: "border-muted-foreground/30",
    badge: null,
    buttonText: "Upgrade",
    disabled: false,
  },
  {
    id: "gold",
    name: "Gold Miner",
    icon: Crown,
    price: "₦45,000",
    period: "/month",
    dailyLimit: "₦750,000",
    dailyAmount: 750000,
    minesPerDay: 5,
    features: [
      "5 mines per day",
      "₦750,000 daily limit",
      "Boosted hash rate (3x)",
      "24/7 VIP support",
      "Advanced analytics",
      "Early access features",
    ],
    color: "border-primary/50",
    badge: "Popular",
    buttonText: "Upgrade",
    disabled: false,
  },
  {
    id: "platinum",
    name: "Platinum Miner",
    icon: Rocket,
    price: "₦100,000",
    period: "/month",
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
      "Exclusive rewards",
    ],
    color: "border-primary",
    badge: "Best Value",
    buttonText: "Upgrade",
    disabled: false,
  },
];

const MinerPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = localStorage.getItem("miner_plan") || "free";

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "🔒 Payment Required",
      description: "Contact support to upgrade your mining plan. Payment integration coming soon.",
      duration: 4000,
      className: "bg-card text-foreground border-primary/30 rounded-xl",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
          <p className="text-xs text-muted-foreground">Choose a plan that fits your goals</p>
        </div>
      </div>

      {/* Current Plan Info */}
      <div className="flex items-center gap-2 mb-6 px-3 py-2.5 bg-card rounded-lg border border-border">
        <Shield className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Active plan: <span className="text-primary font-semibold capitalize">{currentPlan} Miner</span>
        </p>
      </div>

      {/* Plans Grid */}
      <div className="space-y-4 pb-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-200 ${plan.color} ${
                isActive ? "ring-1 ring-primary/40" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg text-[10px] bg-primary text-primary-foreground border-none">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Up to {plan.dailyLimit}/day · {plan.minesPerDay}x mines
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{plan.price}</p>
                    <p className="text-[10px] text-muted-foreground">{plan.period}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => !isActive && handleUpgrade(plan.id)}
                  disabled={isActive}
                  className={`w-full h-10 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isActive ? "Current Plan" : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MinerPlans;
