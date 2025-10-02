import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import Breadcrumb from '@/components/Breadcrumb';
import FAQSection from '@/components/FAQSection';
import { Shield, Clock, Users, CheckCircle } from 'lucide-react';

const Sobre = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre - Números Mega Sena',
    description: 'Conheça o Números das Loterias, o portal de confiança para resultados oficiais das loterias brasileiras com mais de 5 anos de experiência.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Números Mega Sena',
      description: 'Portal de resultados das loterias brasileiras',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      foundingDate: '2020',
      areaServed: 'BR',
    },
  };

  return (
    <>
      <SEOHead
        title="Sobre - Números Mega Sena | Portal de Confiança para Resultados de Loterias"
        description="Conheça o Números das Loterias, o portal de confiança para resultados oficiais das loterias brasileiras com mais de 5 anos de experiência."
        keywords="sobre números mega sena, portal loterias, resultados oficiais, experiência, confiança"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/sobre` : '/sobre'}
        jsonLd={jsonLd}
      />
      <Helmet>
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/sobre` : '/sobre'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <Breadcrumb items={[
            { name: 'Início', path: '/' },
            { name: 'Sobre', path: '/sobre' },
          ]} />

          {/* Hero Section */}
          <section className="bg-gradient-hero py-16 text-primary-foreground">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bem-vindo ao Números das Loterias</h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl">
                O portal de confiança para resultados oficiais das loterias brasileiras
              </p>
            </div>
          </section>

          {/* Content Section */}
          <section className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Introduction */}
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                <p className="text-lg text-foreground leading-relaxed">
                  O Números das Loterias é o portal de confiança para resultados oficiais das loterias brasileiras. 
                  Com mais de 5 anos de experiência, oferecemos informações precisas, atualizadas em tempo real e 
                  ferramentas profissionais para apostadores de todo o Brasil.
                </p>
              </div>

              {/* Mission and Authority */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="w-8 h-8 text-primary" />
                  Nossa Missão e Autoridade
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Missão
                    </h3>
                    <p className="text-muted-foreground">
                      Ser a fonte mais confiável e rápida para resultados das loterias brasileiras, oferecendo 
                      tecnologia avançada para análise de dados e estratégias de apostas.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Experiência
                    </h3>
                    <p className="text-muted-foreground">
                      Mais de 5 anos monitorando e reportando resultados de loterias, com milhares de usuários 
                      ativos mensalmente que confiam em nossos dados.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6 md:col-span-2">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Equipe Especializada
                    </h3>
                    <p className="text-muted-foreground">
                      Contamos com desenvolvedores experientes em APIs de loterias e analistas de dados 
                      especializados em probabilidades e estatísticas de sorteios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transparency */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Transparência e Independência</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Números das Loterias é um portal completamente independente e não possui qualquer vínculo 
                  comercial ou institucional com a Caixa Econômica Federal. Nossa independência garante 
                  informações imparciais e análises objetivas dos resultados.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Certificação de Dados</h3>
                  <p className="text-muted-foreground">
                    Todos os resultados são verificados contra múltiplas fontes oficiais e passam por validação 
                    automática antes da publicação, garantindo 99.9% de precisão.
                  </p>
                </div>
              </div>

              {/* Sources and Methodology */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Fontes e Metodologia</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Fontes Primárias</h3>
                    <p className="text-muted-foreground">
                      APIs oficiais da Caixa Econômica Federal, dados públicos governamentais e validação 
                      cruzada com múltiplas bases de dados.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Atualização em Tempo Real</h3>
                    <p className="text-muted-foreground">
                      Sistema automatizado que monitora e atualiza resultados a cada minuto durante os horários 
                      de sorteio, garantindo informação instantânea.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Precisão Garantida</h3>
                    <p className="text-muted-foreground">
                      Recomendamos sempre confirmar prêmios acima de R$ 10.000 diretamente nas casas lotéricas 
                      ou canais oficiais da Caixa para procedimentos de resgate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tools and Resources */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Ferramentas e Recursos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Oferecemos diversas ferramentas para auxiliar os apostadores, como o gerador de números 
                  aleatórios que respeita as regras de cada loteria. Estas ferramentas são desenvolvidas 
                  apenas para fins informativos e de entretenimento, sem qualquer garantia de sucesso nas apostas.
                </p>
              </div>

              {/* Responsible Gaming */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Jogo Responsável</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Incentivamos o jogo responsável e consciente. As loterias devem ser encaradas como forma de 
                  entretenimento, e não como fonte de renda ou solução para problemas financeiros. Aposte apenas 
                  o que você pode perder e sempre com moderação.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <FAQSection />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Sobre;
