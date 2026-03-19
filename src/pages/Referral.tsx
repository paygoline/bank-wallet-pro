import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Gift, Users, TrendingUp, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const REFERRAL_BONUS = 5000; // ₦5,000 per referral

const Referral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [referralCode] = useState(() => {
    const saved = localStorage.getItem("referral_code");
    if (saved) return saved;
    const code = "MNR" + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem("referral_code", code);
    return code;
  });

  const [referrals, setReferrals] = useState<Array<{ name: string; date: string; bonus: number }>>(() => {
    const saved = localStorage.getItem("referral_list");
    return saved ? JSON.parse(saved) : [];
  });

  const [totalEarnings, setTotalEarnings] = useState(() => {
    const saved = localStorage.getItem("referral_earnings");
    return saved ? parseFloat(saved) : 0;
  });

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "📋 Copied!",
        description: `${label} copied to clipboard.`,
        duration: 2000,
        className: "bg-card text-foreground border-primary/30 rounded-xl",
      });
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on MinerPro!",
          text: `Use my referral code ${referralCode} to get started. Join here:`,
          url: referralLink,
        });
      } catch {
        copyToClipboard(referralLink, "Referral link");
      }
    } else {
      copyToClipboard(referralLink, "Referral link");
    }
  };

  // Simulate checking for new referrals from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const usedRef = params.get("ref");
    if (usedRef) {
      localStorage.setItem("referred_by", usedRef);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Referral Program</h1>
          <p className="text-xs text-muted-foreground">Invite friends & earn ₦{REFERRAL_BONUS.toLocaleString()} per referral</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{referrals.length}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Referrals</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <Gift className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">₦{totalEarnings.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Earned</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">₦{REFERRAL_BONUS.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Per Invite</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Card */}
      <Card className="border-primary/30 bg-primary/5 mb-4">
        <CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
              <p className="text-xl font-bold text-primary tracking-[0.3em]">{referralCode}</p>
            </div>
            <Button
              size="icon"
              onClick={() => copyToClipboard(referralCode, "Referral code")}
              className="h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="border-border bg-card mb-4">
        <CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Your Referral Link</p>
          <div className="bg-muted/30 rounded-lg px-3 py-2.5 mb-3">
            <p className="text-xs text-muted-foreground break-all">{referralLink}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(referralLink, "Referral link")}
              variant="outline"
              className="flex-1 h-10 text-xs font-semibold border-primary text-primary hover:bg-primary/5 rounded-xl"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy Link
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-border bg-card mb-5">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-foreground mb-3">How It Works</p>
          <div className="space-y-3">
            {[
              { step: "1", text: "Share your referral code or link with friends" },
              { step: "2", text: "They sign up and activate their miner" },
              { step: "3", text: `You earn ₦${REFERRAL_BONUS.toLocaleString()} bonus credited to your wallet` },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{item.step}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Referral History</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{referrals.length} invites</span>
        </div>

        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No referrals yet</p>
            <p className="text-xs text-muted-foreground/60">Share your code to start earning</p>
          </div>
        ) : (
          <div className="space-y-2 pb-6">
            {referrals.map((ref, i) => (
              <div key={i} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{ref.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ref.date}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-primary">+₦{ref.bonus.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Referral;