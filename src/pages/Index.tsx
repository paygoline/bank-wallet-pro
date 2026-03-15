import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfessionalLoader from "@/components/ProfessionalLoader";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ProfessionalLoader
      fullScreen
      showLogo
      showText
      text="Securing your session..."
    />
  );
};

export default Index;
