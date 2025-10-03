import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: string;
}

const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  keywords,
  jsonLd,
}: SEOHeadProps) => (
  <Head>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Seu Nome ou Empresa" />
    <meta name="publisher" content="Seu Nome ou Empresa" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
    {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
  </Head>
);

export default SEOHead;
