import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const BuyCode = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const navigate = useNavigate();

  const handleProceed = () => {
    if (accountNumber && accountName && bankName) {
      navigate("/payment-confirmation", {
        state: {
          accountNumber,
          accountName,
          bankName,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md space-y-6">
        <p className="text-white text-center text-lg mb-8">
          Input your account details that you would use to make your transaction
        </p>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="h-14 bg-transparent border-2 border-primary text-white placeholder:text-white/60 rounded-xl"
          />

          <Input
            type="text"
            placeholder="Account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="h-14 bg-transparent border-2 border-primary text-white placeholder:text-white/60 rounded-xl"
          />

          <Input
            type="text"
            placeholder="Bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="h-14 bg-transparent border-2 border-primary text-white placeholder:text-white/60 rounded-xl"
          />
        </div>

        <Button
          onClick={handleProceed}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl mt-8"
        >
          PROCEED
        </Button>
      </div>
    </div>
  );
};

export default BuyCode;
