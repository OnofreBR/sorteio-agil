import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';
import NumbersPills from '@/components/NumbersPills';
import PrizeTable from '@/components/PrizeTable';
import { buildUrl } from '@/lib/config/site';
import { LotteryResult, LotterySlug, lotteries } from '@/types/lottery';
import { formatCurrencyBRL, formatDate, formatNumber } from '@/utils/formatters';

interface ContestPageProps {
  result: LotteryResult;
}

const ContestPage: NextPage<ContestPageProps> = ({ result }) => {
  if (!result) {
    return <div>Concurso não encontrado.</div>;
  }

  const { loteria, nome, concurso, data, local, acumulou, dezenas, dezenasOrdemSorteio, trevos, premiacoes, proximoConcurso, dataProximoConcurso, valorEstimadoProximoConcurso } = result;
  const url = `/${loteria}/concurso-${concurso}`;

  return (
    <>
      <SEOHead
        title={`${nome} ${concurso}`}
        description={`Confira o resultado do concurso ${concurso} da ${nome}, sorteado em ${formatDate(data)}.`}
        url={url}
        canonical={url}
      />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{`${nome} ${concurso}`}</h1>
          <p className="text-lg text-gray-600">{`${formatDate(data)} - ${local}`}</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Números Sorteados</h2>
          <NumbersPills numbers={dezenas} />
          {dezenasOrdemSorteio && dezenasOrdemSorteio.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">2º Sorteio</h3>
              <NumbersPills numbers={dezenasOrdemSorteio} />
            </div>
          )}
          {trevos && trevos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Trevos</h3>
              <NumbersPills numbers={trevos} />
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Premiação</h2>
          <PrizeTable tiers={premiacoes} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Próximo Concurso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Concurso</p>
              <p className="text-lg font-bold">{proximoConcurso}</p>
            </div>
            <div>
              <p className="text-gray-600">Data</p>
              <p className="text-lg font-bold">{formatDate(dataProximoConcurso)}</p>
            </div>
            <div>
              <p className="text-gray-600">Valor Estimado</p>
              <p className="text-lg font-bold">{formatCurrencyBRL(valorEstimadoProximoConcurso)}</p>
            </div>
          </div>
        </section>

        <Link href="/">
          <a className="text-blue-500 hover:underline">Voltar para a página inicial</a>
        </Link>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { loteriaSlug, contestNumber } = context.params as { loteriaSlug: LotterySlug, contestNumber: string };

  try {
    const res = await fetch(buildUrl(`/loterias/${loteriaSlug}/${contestNumber}`));
    const result = await res.json();

    return {
      props: {
        result,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default ContestPage;
