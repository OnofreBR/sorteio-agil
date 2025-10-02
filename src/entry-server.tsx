import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
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
import RedirectOldContest from "./pages/RedirectOldContest";
import { getResultByContest } from "./services/lotteryApi";

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
      },
    },
  });

  // Detect contest pages and prefetch data
  const contestMatch = url.match(/^\/([^/]+)\/concurso-(\d+)/);
  if (contestMatch) {
    const [, lottery, contestStr] = contestMatch;
    const contest = parseInt(contestStr, 10);
    
    try {
      // Prefetch contest data
      await queryClient.prefetchQuery({
        queryKey: ['lottery-result', lottery, contest],
        queryFn: () => getResultByContest(lottery, contest),
      });
    } catch (error) {
      console.warn(`SSR prefetch failed for ${lottery} ${contest}:`, error);
    }
  }

  const helmetContext: { helmet?: any } = {};

  const AppRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/:lottery/concurso-:contest" element={<ContestPage />} />
      <Route path="/:lottery/concurso/:contest" element={<RedirectOldContest />} />
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
  
  // Serialize React Query state for client hydration
  const dehydratedState = dehydrate(queryClient);

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
    state: dehydratedState,
  };
}
