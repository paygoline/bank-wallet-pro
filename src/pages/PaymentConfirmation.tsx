import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountNumber, accountName, bankName } = location.state || {};
  const [timer, setTimer] = useState(480); // 8 minutes in seconds
  const [showNotification, setShowNotification] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-black text-white px-4 py-6 relative">
      {/* Notification Banner */}
      {showNotification && (
        <div
          className="fixed top-0 left-0 right-0 bg-[#2a2a2a] shadow-lg p-4 flex items-start gap-3 z-50 animate-in slide-in-from-top duration-300"
          onClick={() => setShowNotification(false)}
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">Pending Payment</h4>
              <span className="text-xs text-gray-400">now</span>
            </div>
            <p className="text-xs text-gray-300">
              Payment bot is activated. 8 minutes to complete.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-6 mt-16">
        {/* Message Box */}
        <div className="border-2 border-primary rounded-xl p-4 bg-black">
          <p className="text-white text-center">
            Hello dear user Kindly make a one-time payment of ₦5,700 to purchase
            your personal activation code.
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
          <p className="text-white/80 text-sm text-center">
            Waiting to receive payment from
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-white/60">NAME:</span> {accountName || "N/A"}
            </p>
            <p>
              <span className="text-white/60">ACCOUNT:</span>{" "}
              {accountNumber || "N/A"}
            </p>
            <p>
              <span className="text-white/60">BANK:</span> {bankName || "N/A"}
            </p>
          </div>
        </div>

        {/* Transfer Pending */}
        <div className="text-center text-lg font-semibold text-white/90">
          TRANSFER PENDING
        </div>

        {/* Receiver Details */}
        <div className="border-2 border-primary rounded-xl p-4 space-y-2 text-sm">
          <p>🧾 Acc: 8142355686</p>
          <p>👤 Name: YILKWAM MANCIT</p>
          <p>🏦 Bank: MOMO PSB</p>
          <p>💰 Amount: ₦5,700</p>
        </div>

        {/* Upload Section */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="upload"
            className="flex-1 h-12 bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center font-bold cursor-pointer"
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
              <span className="text-xs text-white/40">Image</span>
            )}
          </div>
        </div>

        {/* Confirm Payment Button */}
        <Button 
          onClick={handleConfirmPayment}
          disabled={isLoading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "CONFIRM PAYMENT"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
