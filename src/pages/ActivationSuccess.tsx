import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ActivationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/withdraw-success");
    }, 6000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Top Green Banner */}
        <div className="w-full h-16 bg-primary rounded-xl"></div>

        {/* Code Box */}
        <div className="border-2 border-primary rounded-xl p-8 bg-black">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">736373</div>
            <p className="text-white text-lg">
              Your activation code has been successfully activated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
