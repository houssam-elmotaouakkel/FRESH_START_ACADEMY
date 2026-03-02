import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiPhoneCall } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-100 text-primary-900'
        : 'text-secondary-800 hover:text-primary-700 hover:bg-secondary-100/70'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-secondary-200/80">
      <div className="content-wrap px-4">
        <div className="h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">FS</span>
            </div>
            <div>
              <p className="text-lg font-bold text-primary-900 leading-tight">Fresh Start Academy</p>
              <p className="text-xs text-secondary-700">Centre de langues a Rabat</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              Cours
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              A propos
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact" className="btn-secondary text-sm">
              <FiPhoneCall />
              Nous contacter
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin" className="btn-secondary text-sm">
                    Admin
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="btn-secondary text-sm">
                  <FiUser />
                  {user?.firstName || 'Mon compte'}
                </NavLink>
                <button onClick={handleLogout} className="btn-primary text-sm">
                  <FiLogOut />
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary text-sm">
                  Connexion
                </NavLink>
                <NavLink to="/register" className="btn-primary text-sm">
                  Inscription
                </NavLink>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg border border-secondary-300 text-primary-900"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="menu"
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden border-t border-secondary-200 py-4 flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Accueil
            </NavLink>
            <NavLink to="/courses" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Cours
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              A propos
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Contact
            </NavLink>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-3">
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Admin
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  Mon compte
                </NavLink>
                <button onClick={handleLogout} className="btn-primary">
                  <FiLogOut />
                  Deconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3">
                <NavLink to="/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  Connexion
                </NavLink>
                <NavLink to="/register" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Inscription
                </NavLink>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
