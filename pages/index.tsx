import Link from 'next/link';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

const LOTERIAS = [
  {
    name: 'Mega Sena',
    slug: 'megasena',
    image: '/logo.png',
    description: 'Resultados e estatísticas da Mega Sena.'
  },
  {
    name: 'Quina',
    slug: 'quina',
    image: '/logo.png',
    description: 'Resultados e estatísticas da Quina.'
  },
  // Adicione outras loterias conforme necessário
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Números Mega Sena',
  'url': 'https://loteriasresultados.com.br/',
  'description': 'Resultados das principais loterias brasileiras, estatísticas e informações atualizadas.',
  'publisher': {
    '@type': 'Organization',
    'name': 'Números Mega Sena',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://loteriasresultados.com.br/logo.png'
    }
  }
};

export default function Home() {
  return (
    <>
      <SEOHead
        title="Números Mega Sena - Resultados das Loterias Brasileiras"
        description="Confira os resultados, estatísticas e informações das principais loterias do Brasil. Mega Sena, Quina, Lotofácil e muito mais."
        canonical="https://loteriasresultados.com.br/"
        ogImage="/logo.png"
        keywords="mega sena, quina, lotofácil, loterias, resultados, estatísticas, sorteio"
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Loterias Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOTERIAS.map((lot) => (
            <Link
              key={lot.slug}
              href={`/${lot.slug}`}
              className="group block p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={lot.image}
                  alt={lot.name}
                  width={80}
                  height={80}
                  priority
                  className="mb-4 rounded-full border border-gray-200 shadow"
                />
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{lot.name}</h2>
                <p className="text-gray-600 text-center text-sm">{lot.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      {/* Dados estruturados JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
