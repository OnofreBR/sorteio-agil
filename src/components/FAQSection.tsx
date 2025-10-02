import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    question: 'Como conferir os resultados das loterias?',
    answer: 'Você pode conferir os resultados acessando a página inicial do nosso site ou buscando pelo concurso específico da loteria desejada. Atualizamos os resultados em tempo real após cada sorteio.',
  },
  {
    question: 'Como resgatar prêmios das loterias?',
    answer: 'Prêmios até R$ 1.903,98 podem ser resgatados em casas lotéricas. Valores acima devem ser resgatados em agências da Caixa Econômica Federal. É necessário apresentar o bilhete premiado e documento de identidade.',
  },
  {
    question: 'Quais são os horários dos sorteios?',
    answer: 'A maioria dos sorteios acontece às 20h (horário de Brasília). Mega-Sena, Quina e Lotofácil são sorteadas neste horário. Alguns concursos especiais podem ter horários diferentes.',
  },
  {
    question: 'Quais os dias de sorteio de cada loteria?',
    answer: 'Cada loteria tem dias específicos: Mega-Sena (quartas e sábados), Quina (diariamente), Lotofácil (segunda a sábado), Lotomania (terças, quintas e sábados), entre outras. Consulte a página específica de cada loteria para detalhes.',
  },
  {
    question: 'Até que horas posso fazer apostas?',
    answer: 'As apostas podem ser feitas até 19h (horário de Brasília) do dia do sorteio em casas lotéricas. Pelo internet banking da Caixa, o prazo pode ser um pouco diferente. Consulte os canais oficiais para informações atualizadas.',
  },
  {
    question: 'Os resultados neste site são oficiais?',
    answer: 'Nosso site busca informações de fontes oficiais e APIs públicas, mas recomendamos sempre confirmar prêmios altos diretamente nos canais oficiais da Caixa Econômica Federal antes de resgatar.',
  },
];

export default function FAQSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
