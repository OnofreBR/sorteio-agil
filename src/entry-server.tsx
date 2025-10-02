import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LotteryPage from "./pages/LotteryPage";
import ContestPage from "./pages/ContestPage";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";

export function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic fetching during SSR
        enabled: false,
        retry: false,
      },
    },
  });

  const helmetContext: { helmet?: any } = {};

  const AppRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/:lottery/concurso-:contest" element={<ContestPage />} />
      <Route path="/:lottery" element={<LotteryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider context={helmetContext}>
        <TooltipProvider>
          <StaticRouter location={url}>
            {AppRoutes}
          </StaticRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );

  const { helmet } = helmetContext;

  return {
    html,
    head: helmet
      ? `
        ${helmet.title?.toString() || ""}
        ${helmet.meta?.toString() || ""}
        ${helmet.link?.toString() || ""}
        ${helmet.script?.toString() || ""}
      `
      : "",
  };
}
