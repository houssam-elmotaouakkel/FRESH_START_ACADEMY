import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Tarifs' },
  { id: 'about', label: 'À propos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
    }
  };

  return (
    <>
      <nav className={`fsa-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); goTo('home'); }}>
            <div className="nav-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <strong>Fresh Start Academy</strong>
              <span>Centre de soutien et de langues</span>
            </div>
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => goTo(l.id)}>{l.label}</button>
            ))}
            <button className="btn-nav" onClick={() => goTo('register')}>
              S'inscrire
            </button>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-overlay">
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => goTo(l.id)}>{l.label}</button>
          ))}
          <button className="btn-nav" style={{ marginTop: '8px' }} onClick={() => goTo('register')}>
            S'inscrire
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
