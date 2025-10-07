import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  url?: string;
  ogImage?: string;
  keywords?: string;
  siteName?: string;
  type?: string; // og:type
  jsonLd?: string | Record<string, any>;
  noIndex?: boolean;
}

const BRAND = 'Números Mega Sena';

const SEOHead = ({
  title,
  description,
  canonical,
  url,
  ogImage,
  keywords,
  siteName = BRAND,
  type = 'website',
  jsonLd,
  noIndex = false,
}: SEOHeadProps) => (
  <Head>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}    
    {canonical && <link rel="canonical" href={canonical} />}
    <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

    {/* Open Graph */}
    <meta property="og:title" content={title} />
    {description && <meta property="og:description" content={description} />}
    {ogImage && <meta property="og:image" content={ogImage} />}
    {(url || canonical) && <meta property="og:url" content={url || canonical} />}
    <meta property="og:site_name" content={siteName} />
    <meta property="og:type" content={type} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    {description && <meta name="twitter:description" content={description} />}
    {ogImage && <meta name="twitter:image" content={ogImage} />}

    {/* Fallback author/publisher */}
    <meta name="author" content={siteName} />
    <meta name="publisher" content={siteName} />

    {/* JSON-LD */}
    {jsonLd && (
      <script
        type="application/ld+json"
        // Ensure proper JSON string output
        dangerouslySetInnerHTML={{
          __html: typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd),
        }}
      />
    )}
  </Head>
);

export default SEOHead;
