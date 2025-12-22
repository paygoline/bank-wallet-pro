import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WithdrawSuccess = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Celebration Icon */}
        <div className="flex justify-center">
          <PartyPopper className="w-24 h-24 text-primary" strokeWidth={1.5} />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <p className="text-white text-xl font-semibold">
            Your withdraw has been successful
          </p>
          <p className="text-white/80 text-lg">
            Your payment will be credited to you in 2 minutes. Thanks for your patience.
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <Button 
          onClick={handleBackToDashboard}
          className="w-full max-w-xs h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl mx-auto"
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );
};

export default WithdrawSuccess;
