import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { ChevronRight, Shield } from 'lucide-react';

const Privacidade = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Política de Privacidade - Números Mega Sena',
    description: 'Política de Privacidade do portal Números Mega Sena. Saiba como coletamos, usamos e protegemos suas informações.',
  };

  return (
    <>
      <SEOHead
        title="Política de Privacidade - Números Mega Sena | Proteção de Dados"
        description="Política de Privacidade do portal Números Mega Sena. Saiba como coletamos, usamos e protegemos suas informações."
        keywords="política de privacidade, proteção de dados, privacidade, números mega sena"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/privacidade` : '/privacidade'}
        jsonLd={jsonLd}
      />
      <Helmet>
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/privacidade` : '/privacidade'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Breadcrumb */}
          <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Início</Link></li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground font-medium">Política de Privacidade</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="bg-gradient-hero py-12 text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                Como coletamos, usamos e protegemos suas informações
              </p>
            </div>
          </section>

          {/* Content Section */}
          <section className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">1. Informações Gerais</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Esta Política de Privacidade descreve como o Números MegaSena ("nós", "nosso" ou "site") 
                  coleta, usa e compartilha informações quando você utiliza nosso site. Ao acessar ou utilizar 
                  o Números MegaSena, você concorda com esta Política de Privacidade.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">2. Informações Coletadas</h2>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">2.1. Informações de Uso:</strong> Coletamos informações sobre como você interage com nosso site, 
                      incluindo páginas visitadas, tempo de permanência, e ações realizadas.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">2.2. Informações do Dispositivo:</strong> Coletamos informações sobre o dispositivo que você usa 
                      para acessar nosso site, incluindo modelo, sistema operacional, navegador e configurações 
                      de idioma.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">2.3. Cookies:</strong> Utilizamos cookies e tecnologias similares para melhorar a experiência 
                      do usuário, analisar o tráfego e personalizar conteúdo e anúncios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Uso das Informações</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos as informações coletadas para:
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Fornecer, manter e melhorar nosso site;</li>
                  <li>Personalizar sua experiência;</li>
                  <li>Analisar como nosso site é utilizado;</li>
                  <li>Desenvolver novos produtos e serviços;</li>
                  <li>Exibir anúncios personalizados.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos compartilhar suas informações com:
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Provedores de serviços que nos auxiliam na operação do site;</li>
                  <li>Parceiros de publicidade e análise, como o Google AdSense;</li>
                  <li>Autoridades legais, quando exigido por lei.</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">5. Google AdSense</h2>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos o Google AdSense para exibir anúncios em nosso site. O Google AdSense usa cookies 
                    para personalizar os anúncios exibidos com base em suas visitas anteriores a este e outros 
                    sites. O Google e seus parceiros podem coletar, usar e compartilhar informações sobre você 
                    para personalizar anúncios de acordo com seus interesses.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Você pode optar por não participar da personalização de anúncios do Google visitando{' '}
                    <a 
                      href="https://www.google.com/settings/ads" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Configurações de Anúncios do Google
                    </a>.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">6. Seus Direitos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Você tem direito a:
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Acessar as informações que temos sobre você;</li>
                  <li>Corrigir informações imprecisas;</li>
                  <li>Solicitar a exclusão de suas informações;</li>
                  <li>Optar por não receber comunicações de marketing;</li>
                  <li>Desativar cookies através das configurações do seu navegador.</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">7. Segurança</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de segurança para proteger suas informações, mas nenhum método de 
                  transmissão pela internet ou armazenamento eletrônico é 100% seguro.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">8. Alterações nesta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará 
                  sempre disponível em nosso site.
                </p>
              </div>

              {/* Section 9 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">9. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através 
                  das informações disponíveis em nosso site.
                </p>
              </div>

              {/* Last updated */}
              <div className="bg-muted/50 rounded-lg p-6 mt-8">
                <p className="text-sm text-muted-foreground text-center">
                  Última atualização: Janeiro de 2025
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacidade;
