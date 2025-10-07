import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/termos', label: 'Termos' },
  { href: '/privacidade', label: 'Privacidade' },
];

const SCROLL_THRESHOLD = 24;
const SCROLL_THROTTLE = 80; // ms

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeout: number | undefined;

    const handleScroll = () => {
      timeout = undefined;
      const shouldHide = window.scrollY > SCROLL_THRESHOLD;
      setIsHidden(shouldHide);
    };

    const onScroll = () => {
      if (timeout !== undefined) return;
      timeout = window.setTimeout(handleScroll, SCROLL_THROTTLE);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <header className={`site-header ${isHidden ? 'header--hidden' : ''}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Voltar para a página inicial">
          <Image src="/logo.png" alt="Números Mega Sena" width={160} height={40} priority />
          <span className="site-header__title">Números Mega Sena</span>
        </Link>

        <nav aria-label="Links institucionais" className="site-header__nav">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

