import { hydrateRoot, createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Read server-injected state (only if it's valid JSON, not a placeholder comment)
const stateElement = document.getElementById("__RQ_STATE");
let dehydratedState = undefined;

if (stateElement && stateElement.textContent) {
  const content = stateElement.textContent.trim();
  // Only parse if it's not a comment placeholder and not empty
  if (content && !content.startsWith('<!--') && content !== '{}') {
    try {
      dehydratedState = JSON.parse(content);
    } catch (e) {
      console.warn('Failed to parse dehydrated state, using undefined:', e);
    }
  }
}

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
