import { Landmark, ShieldCheck, Delete, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProfessionalLoader from "@/components/ProfessionalLoader";

const Withdraw = () => {
  const [code, setCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (code.length < 6) {
      setCode(code + num);
    }
  };

  const handleBackspace = () => {
    setCode(code.slice(0, -1));
  };

  const handleSubmit = () => {
    if (code === "200420") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/activation-success");
      }, 200);
    } else {
      setShowAlert(true);
    }
  };

  const handleBuyCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/buy-code");
    }, 200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {isLoading && (
        <ProfessionalLoader fullScreen overlay showText text="Please wait..." />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Shield Logo with Bank Icon */}
        <div className="mb-8 relative">
          <ShieldCheck className="w-32 h-32 text-primary" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Landmark className="w-12 h-12 text-primary" strokeWidth={2} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold text-white mb-8 text-center">
          Enter Your WITHDRAW CODE
        </h1>

        {/* Code Input Display */}
        <div className="w-full max-w-xs mb-12">
          <div className="h-16 bg-white rounded-xl flex items-center justify-center">
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-black"
                  style={{ opacity: i < code.length ? 1 : 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="w-full max-w-xs mb-8">
          <div className="grid grid-cols-3 gap-4">
            {/* Row 1 */}
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white text-2xl font-semibold transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 2 */}
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white text-2xl font-semibold transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 3 */}
            {[7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white text-2xl font-semibold transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 4 */}
            <button
              onClick={handleBackspace}
              className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white flex items-center justify-center transition-colors"
            >
              <Delete className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => handleNumberClick("0")}
              className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white text-2xl font-semibold transition-colors"
            >
              0
            </button>
            
            <button
              onClick={handleSubmit}
              className="h-16 bg-primary hover:bg-primary/90 rounded-xl text-white flex items-center justify-center transition-colors"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Buy Code Button */}
        <Button
          onClick={handleBuyCode}
          className="w-full max-w-xs h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl"
        >
          Buy Code
        </Button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-white max-w-sm mx-4 rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <AlertDialogTitle className="text-black font-bold">
                Activation Pin
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-black text-left space-y-3">
              <p>
                Invalid activation pin. Please purchase your activation pin from
                the application to continue the process and start making money
                daily. Hope you enjoy our app.
              </p>
              <p className="text-sm">
                <strong>NOTE:</strong> Your activation pin cannot be shared. Each
                activation code is designed for one user.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end">
            <button
              onClick={() => {
                setShowAlert(false);
                handleBuyCode();
              }}
              className="text-primary font-bold text-sm hover:underline"
            >
              BUY CODE
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Withdraw;
