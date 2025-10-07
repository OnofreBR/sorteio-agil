import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center space-x-2 hover:opacity-90 transition-opacity" href="/">
          <Image
            src="/logo.png"
            alt="Números Mega Sena"
            width={160}
            height={40}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sobre"
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Sobre
          </Link>
          <Link
            href="/termos"
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Termos
          </Link>
          <Link
            href="/privacidade"
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Privacidade
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
