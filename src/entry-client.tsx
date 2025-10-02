import { createRoot, hydrateRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
});

if (rootElement) {
  const app = (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );

  const hasSSRMarkup = !!rootElement.firstElementChild; // ignore comment nodes like <!--app-html-->

  try {
    if (hasSSRMarkup) {
      hydrateRoot(rootElement, app);
    } else {
      createRoot(rootElement).render(app);
    }
  } catch (e) {
    console.warn('Hydration failed, falling back to client render:', e);
    rootElement.innerHTML = '';
    createRoot(rootElement).render(app);
  }
}
