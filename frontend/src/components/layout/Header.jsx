import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full transition-all duration-300 ${
      isActive
        ? 'text-primary-300 font-semibold'
        : 'text-gray-700 hover:text-primary-300'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">FS</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Fresh Start <span className="text-primary-300">Academy</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              Cours
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              À Propos
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4">
                {user?.role === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    className="px-4 py-2 text-primary-300 hover:text-primary-500 font-medium"
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/dashboard"
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-primary-300"
                >
                  <FiUser />
                  <span>{user?.firstName}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 btn-secondary text-sm"
                >
                  <FiLogOut />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <NavLink to="/login" className="btn-secondary text-sm">
                  Connexion
                </NavLink>
                <NavLink to="/register" className="btn-primary text-sm">
                  S'inscrire
                </NavLink>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </NavLink>
              <NavLink
                to="/courses"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Cours
              </NavLink>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                À Propos
              </NavLink>
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>

              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <NavLink
                      to="/admin"
                      className="px-4 py-2 text-primary-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </NavLink>
                  )}
                  <NavLink
                    to="/dashboard"
                    className="px-4 py-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon compte
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-500"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <NavLink
                    to="/login"
                    className="btn-secondary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header