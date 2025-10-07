import React from 'react';
import SEOHead from '@/components/SEOHead';

export default function Termos() {
  return (
    <>
      <SEOHead
        title="Termos de Uso - Números Mega Sena"
        description="Termos de Uso do portal Números Mega Sena"
        canonical={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/termos`}
        url={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/termos`}
        type="article"
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Termos de Uso</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-xl text-center mb-6">
            Condições de uso do portal Números Mega Sena
          </p>

          <section>
            <h2 className="text-3xl font-bold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar o site Números MegaSena (“nós”, “nosso” ou “site”), você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá acessar ou utilizar nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Alterações nos Termos</h2>
            <p>
              Podemos revisar e atualizar estes Termos de Uso periodicamente a nosso critério exclusivo. Todas as alterações entram em vigor imediatamente após sua publicação. É sua responsabilidade verificar periodicamente se houve alterações.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. Uso do Site</h2>
            <p className="mb-4">
              3.1. O Números MegaSena é um portal informativo que disponibiliza resultados das loterias brasileiras e ferramentas para apostadores. Todas as informações são fornecidas apenas para fins informativos.
            </p>
            <p className="mb-4">
              3.2. Você concorda em utilizar o site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja ou iniba o uso e aproveitamento do site.
            </p>
            <p>
              3.3. Você não deve tentar obter acesso não autorizado ao nosso servidor ou qualquer servidor, computador ou banco de dados conectado ao nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Precisão das Informações</h2>
            <p className="mb-4">
              4.1. Nos esforçamos para garantir que todas as informações apresentadas em nosso site sejam precisas e atualizadas. No entanto, não garantimos a exatidão, integridade ou atualidade dessas informações.
            </p>
            <p className="mb-4">
              4.2. Para fins de conferência de apostas e prêmios, recomendamos que você sempre verifique os resultados oficiais nos canais da Caixa Econômica Federal.
            </p>
            <p>
              4.3. Não nos responsabilizamos por quaisquer perdas ou danos que possam resultar da confiança nas informações contidas em nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Ferramentas e Recursos</h2>
            <p className="mb-4">
              5.1. Nosso site oferece ferramentas como geradores de números aleatórios para diferentes loterias. Estas ferramentas são fornecidas apenas para fins de entretenimento e conveniência.
            </p>
            <p>
              5.2. Não garantimos que o uso dessas ferramentas resultará em qualquer ganho nas loterias. A participação em jogos de loteria envolve risco e chance, sem qualquer garantia de retorno financeiro.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Propriedade Intelectual</h2>
            <p className="mb-4">
              6.1. Todo o conteúdo, design, gráficos, interface, código e software usados no site são de nossa propriedade ou de nossos licenciadores e são protegidos por leis de propriedade intelectual.
            </p>
            <p>
              6.2. Você não tem permissão para copiar, reproduzir, republicar, fazer download, postar, transmitir ou distribuir qualquer material do site sem nossa autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Links para Outros Sites</h2>
            <p>
              Nosso site pode conter links para sites de terceiros. Esses links são fornecidos apenas para sua conveniência. Não temos controle sobre o conteúdo desses sites e não nos responsabilizamos por qualquer perda ou dano que possa surgir do seu uso.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Publicidade</h2>
            <p className="mb-4">
              8.1. Nosso site exibe anúncios fornecidos por redes de publicidade terceirizadas, como o Google AdSense.
            </p>
            <p>
              8.2. Não endossamos nem nos responsabilizamos por quaisquer produtos ou serviços anunciados em nosso site. Qualquer transação que você faça com anunciantes é entre você e o anunciante.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Limitação de Responsabilidade</h2>
            <p className="mb-4">
              9.1. O uso do site Números MegaSena é por sua própria conta e risco. O site é fornecido “como está” e “como disponível”, sem garantias de qualquer tipo.
            </p>
            <p>
              9.2. Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, consequenciais, especiais ou punitivos resultantes do uso ou da impossibilidade de usar nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Independência</h2>
            <p>
              O Números MegaSena é um site independente e não possui qualquer vínculo ou afiliação com a Caixa Econômica Federal ou com órgãos oficiais responsáveis pelas loterias no Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Lei Aplicável</h2>
            <p>
              Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através das informações disponíveis em nosso site.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
