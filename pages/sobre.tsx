import React from 'react';
import SEOHead from '@/components/SEOHead';

export default function Sobre() {
  return (
    <>
      <SEOHead
        title="Sobre - Números Mega Sena"
        description="Conheça o Números Mega Sena - Portal de confiança para resultados oficiais das loterias brasileiras."
        canonical={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/sobre`}
        url={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/sobre`}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Bem-vindo ao Números das Loterias</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <p className="text-xl text-center mb-6">
              O portal de confiança para resultados oficiais das loterias brasileiras
            </p>
            <p className="text-lg">
              O Números das Loterias é o portal de confiança para resultados oficiais das loterias brasileiras. Com mais de 5 anos de experiência, oferecemos informações precisas, atualizadas em tempo real e ferramentas profissionais para apostadores de todo o Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Nossa Missão e Autoridade</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Missão</h3>
                <p>
                  Ser a fonte mais confiável e rápida para resultados das loterias brasileiras, oferecendo tecnologia avançada para análise de dados e estratégias de apostas.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Experiência</h3>
                <p>
                  Mais de 5 anos monitorando e reportando resultados de loterias, com milhares de usuários ativos mensalmente que confiam em nossos dados.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Equipe Especializada</h3>
                <p>
                  Contamos com desenvolvedores experientes em APIs de loterias e analistas de dados especializados em probabilidades e estatísticas de sorteios.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Transparência e Independência</h2>
            <p className="mb-4">
              O Números das Loterias é um portal completamente independente e não possui qualquer vínculo comercial ou institucional com a Caixa Econômica Federal. Nossa independência garante informações imparciais e análises objetivas dos resultados.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Certificação de Dados</h3>
                <p>
                  Todos os resultados são verificados contra múltiplas fontes oficiais e passam por validação automática antes da publicação, garantindo 99.9% de precisão.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Fontes e Metodologia</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Fontes Primárias</h3>
                <p>
                  APIs oficiais da Caixa Econômica Federal, dados públicos governamentais e validação cruzada com múltiplas bases de dados.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Atualização em Tempo Real</h3>
                <p>
                  Sistema automatizado que monitora e atualiza resultados a cada minuto durante os horários de sorteio, garantindo informação instantânea.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Precisão Garantida</h3>
                <p>
                  Recomendamos sempre confirmar prêmios acima de R$ 10.000 diretamente nas casas lotéricas ou canais oficiais da Caixa para procedimentos de resgate.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Ferramentas e Recursos</h2>
            <p>
              Oferecemos diversas ferramentas para auxiliar os apostadores, como o gerador de números aleatórios que respeita as regras de cada loteria. Estas ferramentas são desenvolvidas apenas para fins informativos e de entretenimento, sem qualquer garantia de sucesso nas apostas.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Jogo Responsável</h2>
            <p>
              Incentivamos o jogo responsável e consciente. As loterias devem ser encaradas como forma de entretenimento, e não como fonte de renda ou solução para problemas financeiros. Aposte apenas o que você pode perder e sempre com moderação.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
