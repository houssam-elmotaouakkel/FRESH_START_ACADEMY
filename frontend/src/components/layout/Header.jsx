import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiPhoneCall } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import LanguageSwitcher from '../common/LanguageSwitcher';
import DarkModeToggle from '../common/DarkModeToggle';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-100 dark:bg-primary-700/20 text-primary-900 dark:text-primary-300'
        : 'text-secondary-800 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-secondary-100/70 dark:hover:bg-gray-800'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-secondary-200/80 dark:border-gray-700/80">
      <div className="content-wrap px-4">
        <div className="h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">FS</span>
            </div>
            <div>
              <p className="text-lg font-bold text-primary-900 dark:text-white leading-tight">Fresh Start Academy</p>
              <p className="text-xs text-secondary-700 dark:text-gray-400">{t('header.subtitle')}</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass}>
              {t('common.home')}
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              {t('common.courses')}
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              {t('common.about')}
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              {t('common.contact')}
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <DarkModeToggle />
            <LanguageSwitcher />
            <Link to="/contact" className="btn-secondary text-sm">
              <FiPhoneCall />
              {t('common.contactUs')}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin" className="btn-secondary text-sm">
                    {t('common.admin')}
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="btn-secondary text-sm">
                  <FiUser />
                  {user?.firstName || t('common.myAccount')}
                </NavLink>
                <button onClick={handleLogout} className="btn-primary text-sm">
                  <FiLogOut />
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary text-sm">
                  {t('common.login')}
                </NavLink>
                <NavLink to="/register" className="btn-primary text-sm">
                  {t('common.register')}
                </NavLink>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg border border-secondary-300 dark:border-gray-600 text-primary-900 dark:text-gray-200"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden border-t border-secondary-200 dark:border-gray-700 py-4 flex flex-col gap-2" role="navigation" aria-label="Menu mobile">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              {t('common.home')}
            </NavLink>
            <NavLink to="/courses" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              {t('common.courses')}
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              {t('common.about')}
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              {t('common.contact')}
            </NavLink>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-3">
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    {t('common.admin')}
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  {t('common.myAccount')}
                </NavLink>
                <button onClick={handleLogout} className="btn-primary">
                  <FiLogOut />
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3">
                <NavLink to="/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  {t('common.login')}
                </NavLink>
                <NavLink to="/register" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                  {t('common.register')}
                </NavLink>
              </div>
            )}

            <LanguageSwitcher variant="mobile" />
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
