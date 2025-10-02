import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import LotteryPage from "./pages/LotteryPage";
import ContestPage from "./pages/ContestPage";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import RedirectOldContest from "./pages/RedirectOldContest";

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          
          {/* Formato de URL: /maismilionaria/concurso-289 */}
          <Route path="/:lottery/concurso-:contest" element={<ContestPage />} />
          
          {/* Redirect old format to new format */}
          <Route path="/:lottery/concurso/:contest" element={<RedirectOldContest />} />
          
          {/* Página de índice por loteria */}
          <Route path="/:lottery" element={<LotteryPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
