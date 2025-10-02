import { useEffect, useRef, useState } from 'react';

interface AdSenseAdProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

const AdSenseAd = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}: AdSenseAdProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only render ads on client-side to avoid SSR hydration mismatch
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    try {
      // Check if adsbygoogle is loaded
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isMounted]);

  // Don't render during SSR to avoid hydration mismatch
  if (!isMounted) {
    return <div className={`adsense-container ${className}`} style={{ minHeight: '250px' }} />;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6966814102206925"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSenseAd;
