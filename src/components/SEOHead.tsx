import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  url?: string
  ogImage?: string
  keywords?: string
  type?: string
  jsonLd?: any
}

const SEOHead = ({
  title = 'Resultados das Loterias Brasileiras - Números Mega Sena',
  description = 'Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real.',
  canonical,
  url,
  ogImage = '/logo.png',
  keywords = 'mega sena, quina, lotofácil, lotomania, dupla sena, timemania, dia de sorte, super sete, mais milionária, resultados, loterias',
  type = 'website',
  jsonLd,
}: SEOHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImage} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Head>
  )
}

export default SEOHead