import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const handleRecheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      navigate("/activation-success");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive-foreground" />
          </div>
        </div>

        <div className="border-2 border-primary rounded-xl p-6 bg-card">
          <p className="text-foreground text-center text-sm">
            Payment not confirmed yet by the bank. Make sure you complete your payment and upload your receipt before receiving your activation code.
          </p>
        </div>

        <Button
          onClick={handleRecheck}
          disabled={isChecking}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl"
        >
          {isChecking ? <Loader2 className="w-6 h-6 animate-spin" /> : "RECHECK"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatus;
