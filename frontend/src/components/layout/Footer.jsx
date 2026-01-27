import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="gradient-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-300 font-bold text-lg">FS</span>
              </div>
              <span className="text-xl font-bold">Fresh Start Academy</span>
            </div>
            <p className="text-white/80 mb-4 leading-relaxed">
              Votre partenaire pour l'apprentissage des langues. Nous vous accompagnons
              vers la maîtrise du français, de l'anglais et de l'arabe.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-300 transition-all"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-300 transition-all"
              >
                <FiTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-300 transition-all"
              >
                <FiInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-300 transition-all"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                  Nos Cours
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nos Cours</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                  Cours de Français
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                  Cours d'Anglais
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                  Cours d'Arabe
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                  Cours Intensifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span className="text-white/80">123 Rue de l'Éducation, Casablanca, Maroc</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="flex-shrink-0" />
                <span className="text-white/80">+212 5 22 00 00 00</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="flex-shrink-0" />
                <span className="text-white/80">contact@freshstart.ma</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70">
            &copy; {currentYear} Fresh Start Academy. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer