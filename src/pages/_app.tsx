import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Lovable tagger for development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      import('lovable-tagger').catch(() => {
        // Tagger not available
      });
    }
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}