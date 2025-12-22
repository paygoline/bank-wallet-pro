import { CreditCard, Send, Landmark, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountName = "Account Name", accountNumber = "Account Number" } = location.state || {};
  const [showMineDialog, setShowMineDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const { toast } = useToast();

  const handleStartMining = () => {
    setShowMineDialog(false);
    
    // Show credit alert toast notification after 4 seconds
    setTimeout(() => {
      toast({
        title: "🛡️ Account Credited",
        description: `Dear ${accountName}, ₦86,000.00 has been successfully credited to your wallet.`,
        duration: 5000,
        className: "bg-slate-900 text-white border-none rounded-xl",
      });
    }, 4000);

    // Show centered success dialog after 6 seconds (4s + 2s) and update balance
    setTimeout(() => {
      setShowSuccessDialog(true);
      setWalletBalance(86000);
    }, 6000);
  };

  const handleWithdraw = () => {
    setIsWithdrawLoading(true);
    
    setTimeout(() => {
      setIsWithdrawLoading(false);
      navigate("/withdraw");
    }, 2500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8 relative">
      {/* Loading Overlay */}
      {isWithdrawLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Loader2 className="w-16 h-16 animate-spin text-white" />
        </div>
      )}
      
      {/* Wallet Balance Card */}
      <Card className="bg-primary border-none mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-white/80">Wallet Balance</p>
            <a href="#" className="text-sm text-white hover:underline">
              Transaction history &gt;
            </a>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">₦{walletBalance.toLocaleString()}</h2>
          <div>
            <p className="text-sm text-white/90">Account: {accountNumber}</p>
            <p className="text-sm text-white/90">Name: {accountName}</p>
          </div>
        </CardContent>
      </Card>

      {/* BUY MINER Button */}
      <Button 
        className="w-full h-16 mb-6 bg-black text-white hover:bg-black/90 text-lg font-bold rounded-xl"
      >
        BUY MINER
      </Button>

      {/* Mine and Withdraw Buttons */}
      <div className="space-y-4 mb-auto">
        <Button 
          onClick={() => setShowMineDialog(true)}
          className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
        >
          <CreditCard className="w-6 h-6" />
          Mine
        </Button>
        <Button 
          onClick={handleWithdraw}
          disabled={isWithdrawLoading}
          className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
        >
          <Send className="w-6 h-6" />
          Withdraw
        </Button>
      </div>

      {/* Bank Icon at Bottom */}
      <div className="flex justify-center mt-8 pt-8">
        <Landmark className="w-32 h-32 text-primary" strokeWidth={1.5} />
      </div>

      {/* Mine Dialog */}
      <Dialog open={showMineDialog} onOpenChange={setShowMineDialog}>
        <DialogContent className="bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black font-bold text-lg">
              <span className="text-2xl">🪙</span>
              Welcome new user
            </DialogTitle>
            <DialogDescription className="text-black text-center pt-4 leading-relaxed">
              Hello dear user your current plan is set on free miner so you can only mine NGN86,000.00 daily are you sure you want to start miner.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button 
              onClick={handleStartMining}
              className="bg-transparent hover:bg-transparent text-primary font-semibold"
            >
              START MINING
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black font-bold text-lg">
              <span className="text-2xl">💰</span>
              Mined successful
            </DialogTitle>
            <DialogDescription className="text-black text-center pt-4 leading-relaxed">
              You have successfully mined NGN86,000.00 to your wallet. Now you can withdraw.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary hover:bg-primary/90 text-white px-6"
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
