import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center space-x-2 hover:opacity-90 transition-opacity" href="/">
          <Image
            src="/NUMEROS MEGA SENA LOGO.jpg"
            alt="Números Mega Sena Logo"
            width={180}
            height={50}
            priority
          />
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/sobre"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
          >
            Sobre
          </Link>
          <Link
            href="/termos"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
          >
            Termos
          </Link>
          <Link
            href="/privacidade"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
          >
            Privacidade
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
