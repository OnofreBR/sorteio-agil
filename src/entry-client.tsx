import { hydrateRoot, createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Read server-injected state
const stateElement = document.getElementById("__RQ_STATE");
const dehydratedState = stateElement 
  ? JSON.parse(stateElement.textContent || "{}")
  : undefined;

// Create QueryClient with hydrated state
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Detect if we have SSR-rendered content
const hasSSRContent = rootElement.hasChildNodes() && rootElement.children.length > 1;

const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <App />
    </HydrationBoundary>
  </QueryClientProvider>
);

if (hasSSRContent) {
  // Hydrate pre-rendered content
  hydrateRoot(rootElement, <AppWithProviders />);
} else {
  // Fallback: mount as regular client app (dev mode)
  createRoot(rootElement).render(<AppWithProviders />);
}
