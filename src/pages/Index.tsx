import { Landmark } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Bank Icon */}
        <Landmark className="w-24 h-24 text-primary" strokeWidth={1.5} />
        
        {/* App Name */}
        <h1 className="text-3xl font-bold tracking-wider text-primary">
          BANK WALLET
        </h1>
        
        {/* Loading Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
