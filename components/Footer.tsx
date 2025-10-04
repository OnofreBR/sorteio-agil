import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="Números Mega Sena Logo"
                width={180}
                height={50}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Resultados das principais loterias brasileiras, atualizados em tempo real.
            </p>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Aviso Legal
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Este é um site independente de resultados de loterias. Não possuímos vínculo com a Caixa Econômica Federal.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Números Mega Sena. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>Jogue com responsabilidade</span>
            <span>•</span>
            <span>+18 anos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
