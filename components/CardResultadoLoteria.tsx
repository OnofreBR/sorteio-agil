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
  const hexColor = lotteryInfo?.hexColor || '#209869';
  
  // Get main prize info with null safety
  const mainPrize = resultado.premiacoes?.[0];
  const valorPremio = mainPrize?.valorPremio || 0;
  const ganhadores = mainPrize?.ganhadores || 0;

  // Helper function to validate hex color
  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
  };

  // Safe helper function to lighten a color (pct 0-100)
  const safeLighten = (hex: string, pct: number): string => {
    if (!isValidHex(hex)) return hex; // fallback to base color
    const clampedPct = Math.max(0, Math.min(100, pct)); // clamp 0-100
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor(((num >> 16) & 0xff) + ((255 - ((num >> 16) & 0xff)) * clampedPct / 100)));
    const g = Math.min(255, Math.floor(((num >> 8) & 0xff) + ((255 - ((num >> 8) & 0xff)) * clampedPct / 100)));
    const b = Math.min(255, Math.floor((num & 0xff) + ((255 - (num & 0xff)) * clampedPct / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Safe helper function to darken a color (pct 0-100)
  const safeDarken = (hex: string, pct: number): string => {
    if (!isValidHex(hex)) return hex; // fallback to base color
    const clampedPct = Math.max(0, Math.min(100, pct)); // clamp 0-100
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - clampedPct / 100)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - clampedPct / 100)));
    const b = Math.max(0, Math.floor((num & 0xff) * (1 - clampedPct / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const lightColor = safeLighten(hexColor, 90);
  const mediumColor = safeLighten(hexColor, 80);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with lottery-specific color */}
      <div
        className="px-6 py-4"
        style={{ 
          background: `linear-gradient(135deg, ${lightColor} 0%, ${mediumColor} 100%)`
        }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{lotteryName}</h3>
        <p className="text-sm text-gray-700">
          Concurso <span className="font-bold">{resultado.concurso}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">{resultado.data}</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-5">
        {/* Números Sorteados with lottery-specific color */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            NÚMEROS SORTEADOS
          </h4>
          <div className="flex flex-wrap gap-2">
            {resultado.dezenas?.map((numero, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full text-white font-bold text-base flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ 
                  background: `linear-gradient(135deg, ${hexColor} 0%, ${safeDarken(hexColor, 20)} 100%)` 
                }}
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
                  className="w-12 h-12 rounded-full text-white font-bold text-base flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
                  }}
                >
                  {String(trevo).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mês da Sorte - Dia de Sorte */}
        {resultado.mesSorte && (
          <div
            className="rounded-lg p-4 border"
            style={{
              background: `linear-gradient(135deg, ${safeLighten(hexColor, 97)} 0%, ${safeLighten(hexColor, 92)} 100%)`,
              borderColor: safeLighten(hexColor, 70)
            }}
          >
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              MÊS DA SORTE
            </h4>
            <p className="text-lg font-bold text-gray-900">{resultado.mesSorte}</p>
          </div>
        )}

        {/* Time do Coração - Timemania */}
        {resultado.loteria === 'timemania' && resultado.observacao && (
          <div
            className="rounded-lg p-4 border"
            style={{
              background: `linear-gradient(135deg, ${safeLighten(hexColor, 97)} 0%, ${safeLighten(hexColor, 92)} 100%)`,
              borderColor: safeLighten(hexColor, 70)
            }}
          >
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              TIME DO CORAÇÃO
            </h4>
            <p className="text-lg font-bold text-gray-900">{resultado.observacao}</p>
          </div>
        )}

        {/* Prêmio e Ganhadores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Prêmio</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(valorPremio)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Ganhadores</p>
            <p className="text-lg font-bold text-gray-900">
              {ganhadores === 0 ? 'Acumulou!' : ganhadores}
            </p>
          </div>
        </div>

        {/* Próximo Concurso */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-2 border border-gray-200">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Próximo Concurso</h5>
          <p className="text-sm text-gray-700">
            Concurso <span className="font-bold">{resultado.proximoConcurso}</span> •{' '}
            {resultado.dataProximoConcurso}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: hexColor }}
          >
            {formatCurrency(resultado.valorEstimadoProximoConcurso)}
          </p>
        </div>

        {/* Ver Detalhes Button with lottery-specific color */}
        <Link
          href={`/${resultado.loteria}/${resultado.concurso}`}
          className="block w-full text-center px-6 py-3 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${hexColor} 0%, ${safeDarken(hexColor, 15)} 100%)` 
          }}
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default CardResultadoLoteria;
