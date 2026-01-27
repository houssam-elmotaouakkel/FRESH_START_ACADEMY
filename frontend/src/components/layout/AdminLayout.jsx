import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { to: '/admin', icon: HiHome, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: HiUsers, label: 'Utilisateurs' },
    { to: '/admin/courses', icon: HiAcademicCap, label: 'Cours' },
    { to: '/admin/enrollments', icon: HiClipboardList, label: 'Inscriptions' },
    { to: '/admin/contacts', icon: HiMail, label: 'Messages' },
    { to: '/admin/testimonials', icon: HiStar, label: 'Témoignages' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-white shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold text-gray-900">
            Admin <span className="text-primary">Panel</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiLogout className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'md:ml-64' : ''} md:ml-64`}>
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <HiMenuAlt2 className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className="text-sm text-gray-600 hover:text-primary"
            >
              ← Retour au site
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;