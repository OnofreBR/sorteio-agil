import Script from 'next/script';

interface AdSenseAdProps {
  slot?: string;
  className?: string;
}

const AdSenseAd = ({ slot, className = '' }: AdSenseAdProps) => {
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6966814102206925"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <Script
        id={`adsense-init-${slot || Math.random()}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.error("AdSense error:", e);
            }
          `,
        }}
      />
    </div>
  );
};

export default AdSenseAd;
