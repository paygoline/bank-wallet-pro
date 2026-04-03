import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Landmark, Copy, CheckCheck, Upload, AlertTriangle, Ban, CheckSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
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
  const { plan } = location.state || {};
  const planId = localStorage.getItem("selected_miner_plan") || "basic";
  const selectedPrice = plan?.price || PLAN_PRICES[planId] || 5700;
  const selectedName = plan?.name || PLAN_NAMES[planId] || "Basic Miner";

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
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
    if (!uploadedImage) {
      toast({
        title: "⚠️ Receipt Required",
        description: "Please upload your payment receipt before confirming.",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate("/payment-status");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-8">
      {/* Important Notice Dialog */}
      <Dialog open={showNotice} onOpenChange={setShowNotice}>
        <DialogContent className="bg-card rounded-2xl shadow-2xl max-w-sm mx-auto border-border p-6 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-destructive/60 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-5">Important Notice</h2>

          <div className="space-y-4 text-sm text-muted-foreground text-left">
            <div className="flex items-start gap-3">
              <Ban className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p>
                He'll dear user copy the <span className="font-bold text-foreground">website account details</span> for transfers.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                Use other banks like palmpay, GTBank, Access, Zenith, etc.{" "}
                <span className="font-bold text-destructive">Do NOT use Opay</span> — payments via Opay may not be confirmed due to network issues.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowNotice(false)}
            className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-base"
          >
            Got It
          </Button>
        </DialogContent>
      </Dialog>

      {/* Bank Icon Header */}
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-5">
        <Landmark className="w-8 h-8 text-primary-foreground" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">Buy Withdrawal Code</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Transfer <span className="font-bold text-foreground">₦{selectedPrice.toLocaleString()}</span> to the account below to get your withdrawal code.
      </p>

      {/* Account Details Card */}
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 space-y-0 mb-6">
        {[
          { icon: "#", label: "Acc No", value: payAccNumber, field: "Account Number", color: "text-primary" },
          { icon: "🏦", label: "Bank", value: payBank, field: "Bank", color: "text-foreground" },
          { icon: "👤", label: "Name", value: payAccName, field: "Name", color: "text-foreground" },
          { icon: "💳", label: "Amount", value: `₦${selectedPrice.toLocaleString()}`, field: "Amount", color: "text-primary" },
        ].map((item, idx, arr) => (
          <div key={item.field}>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-primary font-bold text-lg">{item.icon}</span>
                <span className="font-semibold text-foreground text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${item.color}`}>{item.value}</span>
                {item.field === "Account Number" && (
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-3 rounded-full text-xs font-bold"
                    onClick={() => handleCopy(payAccNumber, item.field)}
                  >
                    {copiedField === item.field ? (
                      <><CheckCheck className="w-3 h-3 mr-1" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3 mr-1" /> Copy</>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {idx < arr.length - 1 && <div className="border-b border-border" />}
          </div>
        ))}
      </div>

      {/* Notice text */}
      <div className="w-full max-w-sm mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-destructive font-bold">⚠️</span> He'll dear user copy the{" "}
          <span className="font-bold text-foreground">website account details</span> for this payment.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Use any banks of your choice (e.g., palmpay, GTBank, Zenith, Access, etc.) —{" "}
          <span className="font-bold text-destructive">Avoid Opay</span>
        </p>
      </div>

      {/* Upload Receipt */}
      <div className="w-full max-w-sm mb-4">
        <label
          htmlFor="upload-receipt"
          className="w-full h-14 bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 font-bold text-primary-foreground cursor-pointer text-base"
        >
          <Upload className="w-5 h-5" />
          Upload Payment Receipt
        </label>
        <input
          id="upload-receipt"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploadedImage && (
          <div className="mt-3 flex items-center gap-3">
            <div className="w-14 h-14 border-2 border-primary rounded-lg overflow-hidden">
              <img src={uploadedImage} alt="Receipt" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-primary font-semibold">✓ Receipt uploaded</span>
          </div>
        )}
      </div>

      {/* I Have Paid Button */}
      <div className="w-full max-w-sm">
        <Button
          onClick={handleConfirmPayment}
          disabled={isLoading || !uploadedImage}
          className="w-full h-14 bg-muted hover:bg-muted/80 text-muted-foreground font-bold text-base rounded-xl disabled:opacity-60"
          variant="secondary"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckSquare className="w-5 h-5 mr-2" />
              I Have Paid
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6">Bank Wallet © 2026</p>
    </div>
  );
};

export default PaymentConfirmation;
