import Link from 'next/link';
import { LotteryResult } from '@/types/lottery';
import { LOTTERY_MAP } from '@/types/lottery';
import { formatCurrency } from '@/services/lotteryApi';

interface CardResultadoLoteriaProps {
  resultado: LotteryResult;
}

const CardResultadoLoteria = ({ resultado }: CardResultadoLoteriaProps) => {
  const lotteryInfo = LOTTERY_MAP[resultado.loteria];
  const lotteryName = lotteryInfo?.name || resultado.loteria;
  
  // Get main prize info
  const mainPrize = resultado.premiacoes[0];
  const valorPremio = mainPrize?.valorPremio || 0;
  const ganhadores = mainPrize?.ganhadores || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-xl font-bold text-gray-800">{lotteryName}</h3>
        <p className="text-sm text-gray-600">
          Concurso <span className="font-semibold">{resultado.concurso}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{resultado.data}</p>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        {/* Números Sorteados */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            NÚMEROS SORTEADOS
          </h4>
          <div className="flex flex-wrap gap-2">
            {resultado.dezenas.map((numero, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center"
              >
                {String(numero).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        {/* Trevos da Sorte - Mais Milionária */}
        {resultado.trevos && resultado.trevos.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              TREVOS DA SORTE
            </h4>
            <div className="flex flex-wrap gap-2">
              {resultado.trevos.map((trevo, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-yellow-500 text-white font-bold text-sm flex items-center justify-center"
                >
                  {String(trevo).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mês da Sorte - Dia de Sorte */}
        {resultado.mesSorte && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              MÊS DA SORTE
            </h4>
            <p className="text-lg font-bold text-gray-800">{resultado.mesSorte}</p>
          </div>
        )}

        {/* Time do Coração - Timemania */}
        {resultado.loteria === 'timemania' && resultado.observacao && (
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              TIME DO CORAÇÃO
            </h4>
            <p className="text-lg font-bold text-gray-800">{resultado.observacao}</p>
          </div>
        )}

        {/* Prêmio e Ganhadores */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Prêmio</p>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(valorPremio)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Ganhadores</p>
            <p className="text-lg font-bold text-gray-800">
              {ganhadores === 0 ? 'Acumulou!' : ganhadores}
            </p>
          </div>
        </div>

        {/* Próximo Concurso */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h5 className="text-xs font-semibold text-gray-700">Próximo Concurso</h5>
          <p className="text-sm text-gray-600">
            Concurso <span className="font-semibold">{resultado.proximoConcurso}</span> •{' '}
            {resultado.dataProximoConcurso}
          </p>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(resultado.valorEstimadoProximoConcurso)}
          </p>
          <Link
            href={`/${resultado.loteria}/concurso/${resultado.concurso}`}
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardResultadoLoteria;
