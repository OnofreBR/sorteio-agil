import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">🎲 Sorteio Ágil</div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Início
            </Link>
            <Link
              href="/contests"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Concursos
            </Link>
            <Link
              href="/statistics"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Estatísticas
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Sobre
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Contato
            </Link>
          </nav>

          {/* Menu Mobile */}
          <Menu as="div" className="md:hidden relative">
            <Menu.Button className="text-white p-2 hover:bg-green-600 rounded-lg transition-colors">
              <Bars3Icon className="h-6 w-6" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/"
                    className={`${
                      active ? 'bg-green-50' : ''
                    } block px-4 py-2 text-gray-800`}
                  >
                    Início
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/contests"
                    className={`${
                      active ? 'bg-green-50' : ''
                    } block px-4 py-2 text-gray-800`}
                  >
                    Concursos
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/statistics"
                    className={`${
                      active ? 'bg-green-50' : ''
                    } block px-4 py-2 text-gray-800`}
                  >
                    Estatísticas
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/about"
                    className={`${
                      active ? 'bg-green-50' : ''
                    } block px-4 py-2 text-gray-800`}
                  >
                    Sobre
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/contact"
                    className={`${
                      active ? 'bg-green-50' : ''
                    } block px-4 py-2 text-gray-800`}
                  >
                    Contato
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;