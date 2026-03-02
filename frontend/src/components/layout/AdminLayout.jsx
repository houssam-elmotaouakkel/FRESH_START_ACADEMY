import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HiHome,
  HiUsers,
  HiAcademicCap,
  HiClipboardList,
  HiMail,
  HiStar,
  HiLogout,
  HiMenuAlt2,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const desktopSidebarPinned = useUiStore((state) => state.desktopSidebarPinned);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const toggleDesktopSidebarPinned = useUiStore((state) => state.toggleDesktopSidebarPinned);

  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDesktopExpanded = desktopSidebarPinned || (isDesktopViewport && isSidebarHovered);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleMediaQueryChange = (event) => {
      const matches = event?.matches ?? mediaQuery.matches;
      setIsDesktopViewport(matches);
      if (matches) {
        closeMobileSidebar();
      }
    };

    handleMediaQueryChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } else {
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  }, [closeMobileSidebar]);

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSidebarMouseEnter = () => {
    if (isDesktopViewport && !desktopSidebarPinned) {
      setIsSidebarHovered(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (isDesktopViewport) {
      setIsSidebarHovered(false);
    }
  };

  const menuItems = [
    { to: '/admin', icon: HiHome, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: HiUsers, label: 'Utilisateurs' },
    { to: '/admin/courses', icon: HiAcademicCap, label: 'Cours' },
    { to: '/admin/enrollments', icon: HiClipboardList, label: 'Inscriptions' },
    { to: '/admin/contacts', icon: HiMail, label: 'Messages' },
    { to: '/admin/testimonials', icon: HiStar, label: 'Temoignages' },
  ];

  const getLinkClass = ({ isActive }) =>
    `group flex items-center rounded-xl py-3 transition-all ${
      isDesktopExpanded ? 'px-4 gap-3 justify-start' : 'px-0 justify-center'
    } ${
      isActive
        ? 'bg-primary-700 text-white shadow-md'
        : 'text-secondary-100/80 hover:text-white hover:bg-white/10'
    }`;

  return (
    <div className="min-h-screen bg-secondary-50">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu admin"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-primary-900/45 md:hidden"
        />
      )}

      <aside
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-primary-900 text-white shadow-2xl transition-[transform,width] duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${isDesktopExpanded ? 'md:w-72' : 'md:w-20'}`}
      >
        <div
          className={`h-20 border-b border-primary-700/50 flex items-center ${
            isDesktopExpanded ? 'px-5 justify-between' : 'px-2 justify-center'
          }`}
        >
          <div className="w-10 h-10 bg-secondary-100 text-primary-900 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            FS
          </div>
          <div
            className={`transition-all duration-200 overflow-hidden ${
              isDesktopExpanded ? 'opacity-100 w-[130px] ml-3' : 'opacity-0 w-0 ml-0'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-300">Admin</p>
            <p className="text-xl font-bold whitespace-nowrap">Fresh Start</p>
          </div>
        </div>

        <nav className={`space-y-2 ${isDesktopExpanded ? 'p-4' : 'p-3'}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={getLinkClass}
              aria-label={item.label}
              title={item.label}
              onClick={closeMobileSidebar}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${
                  isDesktopExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 border-t border-primary-700/50 bg-primary-900 ${
          isDesktopExpanded ? 'p-4' : 'p-3'
        }`}>
          <div className={`flex items-center ${isDesktopExpanded ? 'space-x-3 mb-4' : 'justify-center mb-3'}`}>
            <div className="w-10 h-10 bg-secondary-100 text-primary-900 rounded-full flex items-center justify-center font-medium flex-shrink-0">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div
              className={`transition-all duration-200 overflow-hidden ${
                isDesktopExpanded ? 'opacity-100 w-[150px]' : 'opacity-0 w-0'
              }`}
            >
              <p className="text-sm font-medium text-white whitespace-nowrap">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary-300">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`${isDesktopExpanded ? 'w-full btn-secondary text-sm' : 'w-full flex items-center justify-center rounded-xl border border-secondary-200/50 p-2 text-secondary-100 hover:bg-white/10 transition-colors'}`}
            aria-label="Deconnexion"
            title="Deconnexion"
          >
            <HiLogout className="h-5 w-5" />
            {isDesktopExpanded && <span>Deconnexion</span>}
          </button>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-[margin] duration-200 ${
          isDesktopExpanded ? 'md:ml-72' : 'md:ml-20'
        }`}
      >
        <header className="h-16 bg-white border-b border-secondary-200/70 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg border border-secondary-300 text-primary-900"
            aria-label="Ouvrir le menu admin"
          >
            <HiMenuAlt2 className="h-6 w-6" />
          </button>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={toggleDesktopSidebarPinned}
              className="hidden md:inline-flex px-3 py-2 rounded-lg border border-secondary-300 text-sm font-medium text-primary-700 hover:bg-secondary-50"
              title={desktopSidebarPinned ? 'Reduire la sidebar' : 'Epingler la sidebar'}
              aria-label={desktopSidebarPinned ? 'Reduire la sidebar' : 'Epingler la sidebar'}
            >
              {desktopSidebarPinned ? 'Reduire sidebar' : 'Epingler sidebar'}
            </button>
            <NavLink to="/" className="text-sm font-medium text-primary-700 hover:text-primary-800">
              Retour au site
            </NavLink>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
