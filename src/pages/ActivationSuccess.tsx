import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ActivationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Persist miner activation
    localStorage.setItem("miner_activated", "true");

    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="border-2 border-primary rounded-xl p-8 bg-card">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">736373</div>
            <p className="text-foreground text-lg font-semibold">
              Your miner has been successfully activated!
            </p>
            <p className="text-sm text-muted-foreground">
              You can now mine and withdraw funds. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
