import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { ChevronRight, FileText } from 'lucide-react';

const Termos = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Termos de Uso - Números Mega Sena',
    description: 'Termos de Uso do portal Números Mega Sena. Leia nossas condições de uso e políticas do site.',
  };

  return (
    <>
      <SEOHead
        title="Termos de Uso - Números Mega Sena | Condições de Uso do Portal"
        description="Termos de Uso do portal Números Mega Sena. Leia nossas condições de uso e políticas do site."
        keywords="termos de uso, condições, política, números mega sena"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/termos` : '/termos'}
        jsonLd={jsonLd}
      />
      <Helmet>
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/termos` : '/termos'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Breadcrumb */}
          <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Início</Link></li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground font-medium">Termos de Uso</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="bg-gradient-hero py-12 text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Termos de Uso</h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                Condições de uso do portal Números Mega Sena
              </p>
            </div>
          </section>

          {/* Content Section */}
          <section className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar ou utilizar o site Números MegaSena ("nós", "nosso" ou "site"), você concorda em 
                  cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte 
                  destes termos, não deverá acessar ou utilizar nosso site.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">2. Alterações nos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos revisar e atualizar estes Termos de Uso periodicamente a nosso critério exclusivo. 
                  Todas as alterações entram em vigor imediatamente após sua publicação. É sua responsabilidade 
                  verificar periodicamente se houve alterações.
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Uso do Site</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">3.1.</strong> O Números MegaSena é um portal informativo que disponibiliza resultados das loterias 
                    brasileiras e ferramentas para apostadores. Todas as informações são fornecidas apenas para 
                    fins informativos.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">3.2.</strong> Você concorda em utilizar o site apenas para fins legais e de maneira que não infrinja 
                    os direitos de terceiros ou restrinja ou iniba o uso e aproveitamento do site.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">3.3.</strong> Você não deve tentar obter acesso não autorizado ao nosso servidor ou qualquer servidor, 
                    computador ou banco de dados conectado ao nosso site.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Precisão das Informações</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">4.1.</strong> Nos esforçamos para garantir que todas as informações apresentadas em nosso site sejam 
                    precisas e atualizadas. No entanto, não garantimos a exatidão, integridade ou atualidade 
                    dessas informações.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">4.2.</strong> Para fins de conferência de apostas e prêmios, recomendamos que você sempre verifique os 
                    resultados oficiais nos canais da Caixa Econômica Federal.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">4.3.</strong> Não nos responsabilizamos por quaisquer perdas ou danos que possam resultar da confiança 
                    nas informações contidas em nosso site.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">5. Ferramentas e Recursos</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">5.1.</strong> Nosso site oferece ferramentas como geradores de números aleatórios para diferentes 
                    loterias. Estas ferramentas são fornecidas apenas para fins de entretenimento e conveniência.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">5.2.</strong> Não garantimos que o uso dessas ferramentas resultará em qualquer ganho nas loterias. 
                    A participação em jogos de loteria envolve risco e chance, sem qualquer garantia de retorno 
                    financeiro.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">6. Propriedade Intelectual</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">6.1.</strong> Todo o conteúdo, design, gráficos, interface, código e software usados no site são de 
                    nossa propriedade ou de nossos licenciadores e são protegidos por leis de propriedade intelectual.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">6.2.</strong> Você não tem permissão para copiar, reproduzir, republicar, fazer download, postar, 
                    transmitir ou distribuir qualquer material do site sem nossa autorização prévia por escrito.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">7. Links para Outros Sites</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nosso site pode conter links para sites de terceiros. Esses links são fornecidos apenas para 
                  sua conveniência. Não temos controle sobre o conteúdo desses sites e não nos responsabilizamos 
                  por qualquer perda ou dano que possa surgir do seu uso.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">8. Publicidade</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">8.1.</strong> Nosso site exibe anúncios fornecidos por redes de publicidade terceirizadas, como o 
                    Google AdSense.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">8.2.</strong> Não endossamos nem nos responsabilizamos por quaisquer produtos ou serviços anunciados 
                    em nosso site. Qualquer transação que você faça com anunciantes é entre você e o anunciante.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">9. Limitação de Responsabilidade</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">9.1.</strong> O uso do site Números MegaSena é por sua própria conta e risco. O site é fornecido 
                    "como está" e "como disponível", sem garantias de qualquer tipo.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">9.2.</strong> Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, 
                    incidentais, consequenciais, especiais ou punitivos resultantes do uso ou da impossibilidade 
                    de usar nosso site.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">10. Independência</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Números MegaSena é um site independente e não possui qualquer vínculo ou afiliação com a 
                  Caixa Econômica Federal ou com órgãos oficiais responsáveis pelas loterias no Brasil.
                </p>
              </div>

              {/* Section 11 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">11. Lei Aplicável</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil.
                </p>
              </div>

              {/* Section 12 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">12. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através das 
                  informações disponíveis em nosso site.
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

export default Termos;
