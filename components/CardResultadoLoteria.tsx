import Link from 'next/link';
import { LotteryResult } from '@/types/lottery';
import { LOTTERY_MAP } from '@/types/lottery';
import { formatCurrency } from '@/utils/formatters';

interface CardResultadoLoteriaProps {
  resultado: LotteryResult;
}

const CardResultadoLoteria = ({ resultado }: CardResultadoLoteriaProps) => {
  const lotteryInfo = LOTTERY_MAP[resultado.loteria];
  const lotteryName = lotteryInfo?.name || resultado.loteria;
  
  // Get main prize info with null safety
  const mainPrize = resultado.premiacoes?.[0];
  const valorPremio = mainPrize?.valorPremio || 0;
  const ganhadores = mainPrize?.ganhadores || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{lotteryName}</h3>
        <p className="text-sm text-gray-700">
          Concurso <span className="font-bold">{resultado.concurso}</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">{resultado.data}</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-5">
        {/* Números Sorteados */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            NÚMEROS SORTEADOS
          </h4>
          <div className="flex flex-wrap gap-2">
            {resultado.dezenas?.map((numero, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-base flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                {String(numero).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        {/* Trevos da Sorte - Mais Milionária */}
        {resultado.trevos && resultado.trevos.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
              TREVOS DA SORTE
            </h4>
            <div className="flex flex-wrap gap-2">
              {resultado.trevos.map((trevo, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-base flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  {String(trevo).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mês da Sorte - Dia de Sorte */}
        {resultado.mesSorte && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              MÊS DA SORTE
            </h4>
            <p className="text-xl font-bold text-gray-900">{resultado.mesSorte}</p>
          </div>
        )}

        {/* Time do Coração - Timemania */}
        {resultado.loteria === 'timemania' && resultado.observacao && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              TIME DO CORAÇÃO
            </h4>
            <p className="text-xl font-bold text-gray-900">{resultado.observacao}</p>
          </div>
        )}

        {/* Prêmio e Ganhadores */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Prêmio</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(valorPremio)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Ganhadores</p>
            <p className="text-xl font-bold text-gray-900">
              {ganhadores === 0 ? 'Acumulou!' : ganhadores}
            </p>
          </div>
        </div>

        {/* Próximo Concurso */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Próximo Concurso</h5>
          <p className="text-sm text-gray-700">
            Concurso <span className="font-bold">{resultado.proximoConcurso}</span> •{' '}
            {resultado.dataProximoConcurso}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(resultado.valorEstimadoProximoConcurso)}
          </p>
        </div>

        {/* Ver Detalhes Button - Fixed URL path to match route structure */}
        <Link
          href={`/${resultado.loteria}/${resultado.concurso}`}
          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default CardResultadoLoteria;
