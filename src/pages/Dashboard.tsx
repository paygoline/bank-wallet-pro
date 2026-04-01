import { CreditCard, Send, Landmark, ShieldCheck, Clock, TrendingUp, User, Pickaxe, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ProfessionalLoader from "@/components/ProfessionalLoader";
import { Progress } from "@/components/ui/progress";

const MINING_COOLDOWN_KEY = "last_mining_timestamp";

const PLAN_EARNINGS: Record<string, number> = {
  basic: 86000,
  silver: 250000,
  gold: 750000,
  platinum: 2000000,
};

const PLAN_NAMES: Record<string, string> = {
  basic: "Basic Miner",
  silver: "Silver Miner",
  gold: "Gold Miner",
  platinum: "Platinum Miner",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const accountName = localStorage.getItem("user_account_name") || "Account Name";
  const accountNumber = localStorage.getItem("user_account_number") || "Account Number";
  const [showMineDialog, setShowMineDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("wallet_balance");
    return saved ? parseFloat(saved) : 0;
  });

  // Track withdrawal notifications already shown
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("shown_withdrawal_notifications");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Sync wallet, transactions, and check withdrawal status updates
  useEffect(() => {
    const saved = localStorage.getItem("wallet_balance");
    if (saved !== null) setWalletBalance(parseFloat(saved));
    const savedTx = localStorage.getItem("transactions");
    if (savedTx) setTransactions(JSON.parse(savedTx));

    // Check for approved/rejected withdrawal notifications
    const requests = JSON.parse(localStorage.getItem("withdrawal_requests") || "[]");
    const newShown = new Set(shownNotifications);
    requests.forEach((req: any) => {
      if ((req.status === "approved" || req.status === "rejected") && !shownNotifications.has(req.id)) {
        newShown.add(req.id);
        setTimeout(() => {
          toast({
            title: req.status === "approved" ? "✅ Withdrawal Approved" : "❌ Withdrawal Rejected",
            description: req.status === "approved"
              ? `Your withdrawal of ₦${req.amount.toLocaleString()} has been approved and processed.`
              : `Your withdrawal of ₦${req.amount.toLocaleString()} was rejected by admin.`,
            duration: 6000,
            className: `bg-card text-foreground ${req.status === "approved" ? "border-primary/30" : "border-destructive/30"} rounded-xl`,
          });
        }, 500);
      }
    });
    if (newShown.size !== shownNotifications.size) {
      setShownNotifications(newShown);
      localStorage.setItem("shown_withdrawal_notifications", JSON.stringify([...newShown]));
    }
  }, []);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [miningStep, setMiningStep] = useState("");
  const [canMineToday, setCanMineToday] = useState(true);
  const [cooldownRemaining, setCooldownRemaining] = useState("");
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Array<{type: string; amount: number; date: string; status: string}>>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Check mining cooldown
  useEffect(() => {
    const checkCooldown = () => {
      const lastMined = localStorage.getItem(MINING_COOLDOWN_KEY);
      if (!lastMined) {
        setCanMineToday(true);
        setCooldownRemaining("");
        return;
      }
      const lastTime = parseInt(lastMined);
      const now = Date.now();
      const diff = now - lastTime;
      const oneDay = 24 * 60 * 60 * 1000;

      if (diff >= oneDay) {
        setCanMineToday(true);
        setCooldownRemaining("");
      } else {
        setCanMineToday(false);
        const remaining = oneDay - diff;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setCooldownRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const miningSteps = [
    { progress: 5, text: "Initializing mining engine..." },
    { progress: 12, text: "Connecting to blockchain network..." },
    { progress: 20, text: "Authenticating credentials..." },
    { progress: 30, text: "Scanning available blocks..." },
    { progress: 40, text: "Allocating hash power..." },
    { progress: 50, text: "Mining block #48291..." },
    { progress: 60, text: "Verifying transactions..." },
    { progress: 70, text: "Processing rewards..." },
    { progress: 78, text: "Confirming on network..." },
    { progress: 85, text: "Calculating earnings..." },
    { progress: 92, text: "Crediting wallet..." },
    { progress: 100, text: "Mining complete!" },
  ];

  const handleStartMining = () => {
    setShowMineDialog(false);
    setIsMining(true);
    setMiningProgress(0);
    setMiningStep(miningSteps[0].text);

    let stepIndex = 0;
    const activePlan = localStorage.getItem("selected_miner_plan") || "basic";
    const miningReward = PLAN_EARNINGS[activePlan] || 86000;
    const planName = PLAN_NAMES[activePlan] || "Basic Miner";

    const runStep = () => {
      if (stepIndex >= miningSteps.length) {
        setTimeout(() => {
          setIsMining(false);
          const newBalance = walletBalance + miningReward;
          setWalletBalance(newBalance);
          localStorage.setItem("wallet_balance", newBalance.toString());
          localStorage.setItem(MINING_COOLDOWN_KEY, Date.now().toString());
          setCanMineToday(false);

          const newTx = {
            type: "Mining",
            amount: miningReward,
            date: new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            status: "Completed",
          };
          const updatedTx = [newTx, ...transactions];
          setTransactions(updatedTx);
          localStorage.setItem("transactions", JSON.stringify(updatedTx));

          toast({
            title: "🛡️ Account Credited",
            description: `Dear ${accountName}, ₦${miningReward.toLocaleString()}.00 has been successfully credited to your wallet.`,
            duration: 5000,
            className: "bg-card text-foreground border-primary/30 rounded-xl",
          });

          setShowSuccessDialog(true);
        }, 800);
        return;
      }

      const step = miningSteps[stepIndex];
      setMiningProgress(step.progress);
      setMiningStep(step.text);
      stepIndex++;

      const delay = 600 + Math.random() * 1200;
      setTimeout(runStep, delay);
    };

    setTimeout(runStep, 500);
  };

  const isMinerActivated = localStorage.getItem("miner_activated") === "true";

  const handleWithdraw = () => {
    if (!isMinerActivated) {
      toast({
        title: "🔒 Activation Required",
        description: "You must purchase an activation code before you can withdraw your mined funds.",
        duration: 4000,
        className: "bg-card text-foreground border-destructive/30 rounded-xl",
      });
      navigate("/buy-code");
      return;
    }
    setIsWithdrawLoading(true);
    setTimeout(() => {
      setIsWithdrawLoading(false);
      navigate("/withdraw");
    }, 2500);
  };

  const handleMineClick = () => {
    if (!canMineToday) {
      toast({
        title: "⏳ Mining Cooldown",
        description: `You can mine again in ${cooldownRemaining}. Free plan allows 1 mine per day.`,
        duration: 4000,
        className: "bg-card text-foreground border-primary/30 rounded-xl",
      });
      return;
    }
    setShowMineDialog(true);
  };

  const currentDate = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6 relative">
      {/* Loading Overlays */}
      {isWithdrawLoading && (
        <ProfessionalLoader fullScreen overlay showText text="Processing withdrawal..." />
      )}

      {/* Mining Overlay */}
      {isMining && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 px-8 max-w-sm w-full animate-fade-in">
            {/* Mining animation */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ width: 96, height: 96 }} />
              <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center shadow-[0_0_40px_hsl(160_84%_39%/0.2)]">
                <Pickaxe className="w-10 h-10 text-primary animate-bounce" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground">Mining in Progress</h3>

            {/* Progress bar */}
            <div className="w-full space-y-2">
              <Progress value={miningProgress} className="h-3 bg-muted" />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-mono">{miningStep}</p>
                <p className="text-xs font-bold text-primary">{miningProgress}%</p>
              </div>
            </div>

            {/* Live stats */}
            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Hash Rate</p>
                <p className="text-sm font-bold text-foreground">{(miningProgress * 1.2 + Math.random() * 10).toFixed(1)} MH/s</p>
              </div>
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Est. Reward</p>
                <p className="text-sm font-bold text-primary">₦{(miningProgress * (PLAN_EARNINGS[localStorage.getItem("selected_miner_plan") || "basic"] || 86000) / 100).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Do not close this screen while mining is active
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{accountName}</p>
            <p className="text-xs text-muted-foreground">{currentDate}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isMinerActivated ? 'bg-primary/10 border-primary/30' : 'bg-destructive/10 border-destructive/30'}`}>
          {isMinerActivated ? (
            <>
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Miner Active</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-destructive" />
              <span className="text-[10px] text-destructive font-semibold uppercase tracking-wider">Not Activated</span>
            </>
          )}
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-none mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <CardContent className="p-5 relative">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-primary-foreground/70 uppercase tracking-wider font-medium">Wallet Balance</p>
            <Landmark className="w-5 h-5 text-primary-foreground/40" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4 tracking-tight">
            ₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/80">
            <span>Acct: {accountNumber}</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/40" />
            <span>{accountName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Activation Banner for Free Miners */}
      {!isMinerActivated && (
        <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground mb-1">Unlock Withdrawals</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                You've mined <span className="text-primary font-semibold">₦{walletBalance.toLocaleString("en-NG")}</span> so far — activate to withdraw!
              </p>
              {/* Progress tracker */}
              <div className="mb-3 space-y-1.5">
                <Progress value={Math.min((walletBalance / 500000) * 100, 100)} className="h-2 bg-muted" />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-muted-foreground">₦0</p>
                  <p className="text-[10px] text-primary font-semibold">
                    {walletBalance >= 500000 ? "🎉 Ready to activate!" : `${Math.min(Math.round((walletBalance / 500000) * 100), 100)}% to ₦500,000 goal`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">₦500K</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => navigate("/buy-code")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 h-8 rounded-lg"
              >
                Activate Now — ₦5,700
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mining Status */}
      {!canMineToday && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-card rounded-lg border border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Next mine available in: <span className="text-primary font-semibold">{cooldownRemaining}</span></p>
        </div>
      )}
      {/* Withdrawal Status Tracker */}
      {(() => {
        const requests = JSON.parse(localStorage.getItem("withdrawal_requests") || "[]");
        const recentRequests = requests.slice(0, 3);
        if (recentRequests.length === 0) return null;
        return (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Withdrawal Requests
            </p>
            {recentRequests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    req.status === "pending" ? "bg-yellow-500/15" :
                    req.status === "approved" ? "bg-primary/15" : "bg-destructive/15"
                  }`}>
                    {req.status === "pending" && <Clock className="w-3.5 h-3.5 text-yellow-500" />}
                    {req.status === "approved" && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                    {req.status === "rejected" && <XCircle className="w-3.5 h-3.5 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">₦{req.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{req.date}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  req.status === "pending" ? "text-yellow-500" :
                  req.status === "approved" ? "text-primary" : "text-destructive"
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          onClick={handleMineClick}
          disabled={isMining}
          className="h-14 bg-card hover:bg-card/80 text-foreground border border-border rounded-xl flex flex-col items-center justify-center gap-1"
          variant="ghost"
        >
          <Pickaxe className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold">Mine</span>
        </Button>
        <Button
          onClick={handleWithdraw}
          disabled={isWithdrawLoading}
          className="h-14 bg-card hover:bg-card/80 text-foreground border border-border rounded-xl flex flex-col items-center justify-center gap-1"
          variant="ghost"
        >
          <Send className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold">Withdraw</span>
        </Button>
      </div>

      {/* BUY MINER & REFERRAL */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          onClick={() => navigate("/miner-plans")}
          className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Upgrade Plan
        </Button>
        <Button
          onClick={() => navigate("/referral")}
          variant="outline"
          className="h-12 border-primary text-primary hover:bg-primary/5 font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          Refer & Earn
        </Button>
      </div>

      {/* Transaction History */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Transaction History</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{transactions.length} records</span>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60">Start mining to see your history</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx, i) => (
              <div key={i} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "Mining" ? "bg-primary/15" : "bg-destructive/15"}`}>
                    {tx.type === "Mining" ? (
                      <Pickaxe className="w-4 h-4 text-primary" />
                    ) : (
                      <Send className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{tx.type}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${tx.type === "Mining" ? "text-primary" : "text-destructive"}`}>
                    {tx.type === "Mining" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mine Dialog */}
      <Dialog open={showMineDialog} onOpenChange={setShowMineDialog}>
        <DialogContent className="bg-card rounded-2xl shadow-lg max-w-sm mx-auto border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
              <span className="text-2xl">⛏️</span>
              Start Mining
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-left pt-4 leading-relaxed text-sm">
              Your current plan is <span className="text-primary font-semibold">{PLAN_NAMES[localStorage.getItem("selected_miner_plan") || "basic"] || "Basic Miner"}</span>. You can mine <span className="text-primary font-semibold">₦{(PLAN_EARNINGS[localStorage.getItem("selected_miner_plan") || "basic"] || 86000).toLocaleString()}.00</span> once per day. Do you want to start mining now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowMineDialog(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartMining}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              Start Mining
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-card rounded-2xl shadow-lg max-w-sm mx-auto border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
              <span className="text-2xl">✅</span>
              Mining Successful
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-left pt-4 leading-relaxed text-sm">
              You have successfully mined <span className="text-primary font-semibold">₦{(PLAN_EARNINGS[localStorage.getItem("selected_miner_plan") || "basic"] || 86000).toLocaleString()}.00</span> to your wallet. You can mine again in 24 hours or upgrade your plan for more.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
