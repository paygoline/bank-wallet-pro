import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const WithdrawSuccess = () => {
  const navigate = useNavigate();
  const [withdrawAmount] = useState(() => {
    return parseFloat(localStorage.getItem("pending_withdrawal") || "0");
  });

  useEffect(() => {
    if (withdrawAmount > 0) {
      const currentBalance = parseFloat(localStorage.getItem("wallet_balance") || "0");
      const newBalance = Math.max(0, currentBalance - withdrawAmount);
      localStorage.setItem("wallet_balance", newBalance.toString());
      localStorage.removeItem("pending_withdrawal");

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
      localStorage.setItem("transactions", JSON.stringify([newTx, ...existing]));
    }
  }, [withdrawAmount]);

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
          onClick={() => navigate("/dashboard")}
          className="w-full max-w-xs h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl mx-auto"
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );
};

export default WithdrawSuccess;
