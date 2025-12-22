import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const PaymentStatus = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Warning Message Box */}
        <div className="border-2 border-primary rounded-xl p-6 bg-black">
          <p className="text-white text-center text-sm">
            Payment not confirmed yet by the bank. Make sure you complete your payment before receiving your code.
          </p>
        </div>

        {/* Recheck Button */}
        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl">
          RECHECK
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatus;
