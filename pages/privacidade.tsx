import React from 'react';
import SEOHead from '@/components/SEOHead';
import { buildUrl } from '@/src/lib/config/site';

export default function Privacidade() {
  return (
    <>
      <SEOHead
        title="Política de Privacidade - Números Mega Sena"
        description="Política de Privacidade do Números Mega Sena"
        canonical={buildUrl('/privacidade')}
        url={buildUrl('/privacidade')}
        type="article"
        noIndex={false}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Política de Privacidade</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-xl text-center mb-6">
            Como coletamos, usamos e protegemos suas informações
          </p>

          <section>
            <h2 className="text-3xl font-bold mb-4">1. Informações Gerais</h2>
            <p>
              Esta Política de Privacidade descreve como o Números MegaSena (“nós”, “nosso” ou “site”) coleta, usa e compartilha informações quando você utiliza nosso site. Ao acessar ou utilizar o Números MegaSena, você concorda com esta Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Informações Coletadas</h2>
            <p className="mb-4">
              2.1. Informações de Uso: Coletamos informações sobre como você interage com nosso site, incluindo páginas visitadas, tempo de permanência, e ações realizadas.
            </p>
            <p className="mb-4">
              2.2. Informações do Dispositivo: Coletamos informações sobre o dispositivo que você usa para acessar nosso site, incluindo modelo, sistema operacional, navegador e configurações de idioma.
            </p>
            <p>
              2.3. Cookies: Utilizamos cookies e tecnologias similares para melhorar a experiência do usuário, analisar o tráfego e personalizar conteúdo e anúncios.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. Uso das Informações</h2>
            <p className="mb-2">Utilizamos as informações coletadas para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fornecer, manter e melhorar nosso site;</li>
              <li>Personalizar sua experiência;</li>
              <li>Analisar como nosso site é utilizado;</li>
              <li>Desenvolver novos produtos e serviços;</li>
              <li>Exibir anúncios personalizados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Compartilhamento de Informações</h2>
            <p className="mb-2">Podemos compartilhar suas informações com:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provedores de serviços que nos auxiliam na operação do site;</li>
              <li>Parceiros de publicidade e análise, como o Google AdSense;</li>
              <li>Autoridades legais, quando exigido por lei.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Google AdSense</h2>
            <p className="mb-4">
              Utilizamos o Google AdSense para exibir anúncios em nosso site. O Google AdSense usa cookies para personalizar os anúncios exibidos com base em suas visitas anteriores a este e outros sites. O Google e seus parceiros podem coletar, usar e compartilhar informações sobre você para personalizar anúncios de acordo com seus interesses.
            </p>
            <p>
              Você pode optar por não participar da personalização de anúncios do Google visitando{' '}
              <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Configurações de Anúncios do Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Seus Direitos</h2>
            <p className="mb-2">Você tem direito a:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Acessar as informações que temos sobre você;</li>
              <li>Corrigir informações imprecisas;</li>
              <li>Solicitar a exclusão de suas informações;</li>
              <li>Optar por não receber comunicações de marketing;</li>
              <li>Desativar cookies através das configurações do seu navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Segurança</h2>
            <p>
              Implementamos medidas de segurança para proteger suas informações, mas nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através das informações disponíveis em nosso site.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
