import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-500 to-green-700 py-4">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <span className="text-2xl font-bold text-white">🎲 Sorteio Ágil</span>
        </Link>
        
        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link className="text-white hover:text-green-100 transition-colors font-medium" href="/">
            Início
          </Link>
          <Link className="text-white hover:text-green-100 transition-colors font-medium" href="/contests">
            Concursos
          </Link>
          <Link className="text-white hover:text-green-100 transition-colors font-medium" href="/statistics">
            Estatísticas
          </Link>
          <Link className="text-white hover:text-green-100 transition-colors font-medium" href="/about">
            Sobre
          </Link>
          <Link className="text-white hover:text-green-100 transition-colors font-medium" href="/contact">
            Contato
          </Link>
        </div>
        
        {/* Menu Mobile */}
        <div className="md:hidden relative">
          <button
            className="text-white p-2 hover:bg-green-600 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/contests"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Concursos
              </Link>
              <Link
                href="/statistics"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Estatísticas
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
