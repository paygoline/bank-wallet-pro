import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Withdraw from "./pages/Withdraw";
import BuyCode from "./pages/BuyCode";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PaymentStatus from "./pages/PaymentStatus";
import ActivationSuccess from "./pages/ActivationSuccess";
import WithdrawSuccess from "./pages/WithdrawSuccess";
import MinerPlans from "./pages/MinerPlans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/buy-code" element={<BuyCode />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/activation-success" element={<ActivationSuccess />} />
          <Route path="/withdraw-success" element={<WithdrawSuccess />} />
          <Route path="/miner-plans" element={<MinerPlans />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
