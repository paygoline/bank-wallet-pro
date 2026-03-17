import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const WithdrawSuccess = () => {
  const navigate = useNavigate();
  const [withdrawAmount] = useState(() => {
    const balance = parseFloat(localStorage.getItem("wallet_balance") || "0");
    return balance;
  });

  useEffect(() => {
    // Deduct full balance as withdrawal
    if (withdrawAmount > 0) {
      localStorage.setItem("wallet_balance", "0");

      const newTx = {
        type: "Withdrawal",
        amount: withdrawAmount,
        date: new Date().toLocaleDateString("en-NG", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Completed",
      };
      const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
      const updated = [newTx, ...existing];
      localStorage.setItem("transactions", JSON.stringify(updated));
    }
  }, [withdrawAmount]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <PartyPopper className="w-24 h-24 text-primary" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <p className="text-foreground text-xl font-semibold">
            Your withdrawal has been successful
          </p>
          <p className="text-muted-foreground text-lg">
            ₦{withdrawAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} will be credited to your account in 2 minutes.
          </p>
        </div>

        <Button
          onClick={handleBackToDashboard}
          className="w-full max-w-xs h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl mx-auto"
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );
};

export default WithdrawSuccess;
