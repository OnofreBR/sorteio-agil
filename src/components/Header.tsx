import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lotteries = [
    { name: 'Mega-Sena', slug: 'megasena', color: 'lottery-megasena' },
    { name: 'Quina', slug: 'quina', color: 'lottery-quina' },
    { name: 'Lotofácil', slug: 'lotofacil', color: 'lottery-lotofacil' },
    { name: 'Lotomania', slug: 'lotomania', color: 'lottery-lotomania' },
    { name: 'Dupla Sena', slug: 'duplasena', color: 'lottery-dupla' },
    { name: 'Federal', slug: 'federal', color: 'lottery-federal' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-card-custom">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-smooth">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-lottery">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Números Mega Sena</span>
              <p className="text-xs text-muted-foreground">Resultados Oficiais</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {lotteries.map((lottery) => (
              <Link key={lottery.slug} to={`/${lottery.slug}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-muted transition-smooth"
                >
                  {lottery.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-bounce-in">
            <nav className="flex flex-col space-y-2">
              {lotteries.map((lottery) => (
                <Link key={lottery.slug} to={`/${lottery.slug}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-muted transition-smooth"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {lottery.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;