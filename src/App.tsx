import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import LotteryPage from "./pages/LotteryPage";
import ContestPage from "./pages/ContestPage";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/privacidade" element={<Privacidade />} />
      {/* Formato de URL: /maismilionaria/concurso-289 */}
      <Route path="/:lottery/concurso-:contest/*" element={<ContestPage />} />
      <Route path="/:lottery/concurso/:contest" element={<ContestPage />} />
      {/* Página de índice por loteria */}
      <Route path="/:lottery" element={<LotteryPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
