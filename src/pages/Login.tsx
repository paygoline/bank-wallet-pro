import { Shield, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessionalLoader from "@/components/ProfessionalLoader";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.trim() && accountName.trim() && accountNumber.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        navigate("/dashboard", { 
          state: { 
            accountName, 
            accountNumber 
          } 
        });
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <ProfessionalLoader
        fullScreen
        showLogo
        showText
        text="Verifying your account..."
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Shield with Bank Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Shield className="w-24 h-24 text-foreground" strokeWidth={1.5} />
            <Landmark className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={1.5} />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-center text-3xl font-bold text-primary">
          Bank Wallet
        </h1>

        {/* Input Fields */}
        <div className="space-y-4">
          <Input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-14 rounded-xl border-2 border-primary bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
          <Input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="h-14 rounded-xl border-2 border-primary bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
          <Input
            type="text"
            placeholder="Account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="h-14 rounded-xl border-2 border-primary bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Start Button */}
        <Button
          type="submit"
          className="w-full h-14 rounded-xl text-lg font-bold"
          size="lg"
        >
          START EARNING
        </Button>
      </form>
    </div>
  );
};

export default Login;
