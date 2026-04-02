import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, AlertTriangle, CheckSquare, XCircle, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PLAN_PRICES: Record<string, number> = {
  basic: 5700,
  silver: 15000,
  gold: 45000,
  platinum: 100000,
};

const PLAN_NAMES: Record<string, string> = {
  basic: "Basic Miner",
  silver: "Silver Miner",
  gold: "Gold Miner",
  platinum: "Platinum Miner",
};

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { accountNumber, accountName, bankName, plan } = location.state || {};
  const planId = localStorage.getItem("selected_miner_plan") || "basic";
  const selectedPrice = plan?.price || PLAN_PRICES[planId] || 5700;
  const selectedName = plan?.name || PLAN_NAMES[planId] || "Basic Miner";
  const [timer, setTimer] = useState(480);
  const [showNotification, setShowNotification] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentNotice, setShowPaymentNotice] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const payAccNumber = localStorage.getItem("admin_payment_acc_number") || "8142355686";
  const payAccName = localStorage.getItem("admin_payment_acc_name") || "YILKWAM MANCIT";
  const payBank = localStorage.getItem("admin_payment_bank") || "MOMO PSB";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: `${field} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowNotification(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/payment-status");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 relative">
      {/* Important Payment Notice Dialog */}
      <Dialog open={showPaymentNotice} onOpenChange={setShowPaymentNotice}>
        <DialogContent className="bg-card rounded-2xl shadow-xl max-w-sm mx-auto border-border p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-foreground font-bold text-lg">
              <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              Important Payment Notice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-muted-foreground">•</span>
              <p>Transfer the <span className="font-bold text-foreground">exact amount</span> shown on this page.</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-muted-foreground">•</span>
              <p>Upload a clear <span className="font-bold text-foreground">payment screenshot</span> immediately after transfer.</p>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
              <p>
                <span className="font-bold text-destructive">Avoid using Opay bank.</span>{" "}
                Due to temporary network issues from Opay servers, payments made with Opay may not be confirmed. Please use{" "}
                <span className="font-bold text-foreground">any other Nigerian bank</span> for instant confirmation.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckSquare className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <p>Payments made with other banks are confirmed within minutes.</p>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
              <p>Do not dispute your payment under any circumstances — disputes delay confirmation.</p>
            </div>
          </div>

          <Button
            onClick={() => setShowPaymentNotice(false)}
            className="w-full h-12 mt-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl"
          >
            I Understand
          </Button>
        </DialogContent>
      </Dialog>

      {/* Notification Banner */}
      {showNotification && (
        <div
          className="fixed top-0 left-0 right-0 bg-card shadow-lg p-4 flex items-start gap-3 z-50 animate-in slide-in-from-top duration-300 border-b border-border"
          onClick={() => setShowNotification(false)}
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm text-foreground">Pending Payment</h4>
              <span className="text-xs text-muted-foreground">now</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Payment bot is activated. 8 minutes to complete.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-6 mt-16">
        {/* Message Box */}
        <div className="border-2 border-primary rounded-xl p-4 bg-card">
          <p className="text-foreground text-center">
            Hello dear user, kindly make a one-time payment of <span className="font-bold text-primary">₦{selectedPrice.toLocaleString()}</span> to purchase
            your <span className="font-bold">{selectedName}</span> activation code.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-xl p-3">
          <p className="text-yellow-500 text-sm text-center">
            ⚠️ NOTE: Two users cannot use the same code to avoid being banned 🚫
          </p>
        </div>

        {/* Timer and Waiting Section */}
        <div className="border-2 border-primary rounded-xl p-4 space-y-2">
          <div className="text-4xl font-bold text-primary text-center">
            {formatTime(timer)}
          </div>
          <p className="text-muted-foreground text-sm text-center">
            Waiting to receive payment from
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">NAME:</span>{" "}
              <span className="text-foreground">{accountName || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">ACCOUNT:</span>{" "}
              <span className="text-foreground">{accountNumber || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">BANK:</span>{" "}
              <span className="text-foreground">{bankName || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Transfer Pending */}
        <div className="text-center text-lg font-semibold text-foreground">
          TRANSFER PENDING
        </div>

        {/* Receiver Details */}
        <div className="border-2 border-primary rounded-xl p-4 space-y-2 text-sm text-foreground">
          <p>🧾 Acc: {localStorage.getItem("admin_payment_acc_number") || "8142355686"}</p>
          <p>👤 Name: {localStorage.getItem("admin_payment_acc_name") || "YILKWAM MANCIT"}</p>
          <p>🏦 Bank: {localStorage.getItem("admin_payment_bank") || "MOMO PSB"}</p>
          <p>💰 Amount: ₦{selectedPrice.toLocaleString()}</p>
        </div>

        {/* Upload Section */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="upload"
            className="flex-1 h-12 bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center font-bold text-primary-foreground cursor-pointer"
          >
            UPLOAD
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="w-16 h-16 border-2 border-primary rounded-lg overflow-hidden flex items-center justify-center">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">Image</span>
            )}
          </div>
        </div>

        {/* Confirm Payment Button */}
        <Button
          onClick={handleConfirmPayment}
          disabled={isLoading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "CONFIRM PAYMENT"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
