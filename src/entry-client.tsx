import { hydrateRoot } from 'react-dom/client';
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
  hydrateRoot(
    rootElement,
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
