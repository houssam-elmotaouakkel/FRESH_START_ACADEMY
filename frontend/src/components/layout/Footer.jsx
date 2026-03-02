import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiArrowUpRight } from 'react-icons/fi';

const mapUrl =
  import.meta.env.VITE_CENTER_MAP_URL ||
  'https://www.google.com/maps/search/?api=1&query=Rabat+Maroc';
const centerAddress =
  import.meta.env.VITE_CENTER_ADDRESS || 'Rabat, Maroc';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-primary-900 text-secondary-100">
      <div className="content-wrap px-4 py-14">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary-300 mb-4">Fresh Start Academy</p>
            <h3 className="text-3xl font-bold text-white mb-4">Votre centre de langues a Rabat</h3>
            <p className="text-secondary-100/85 max-w-xl">
              Formations en francais, anglais et arabe avec parcours personnalises,
              classes en petits groupes et suivi pedagogique continu.
            </p>
            <Link to="/register" className="btn-secondary mt-6">
              Commencer l&apos;inscription
              <FiArrowUpRight />
            </Link>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-secondary-100/85">
              <li><Link className="hover:text-white" to="/">Accueil</Link></li>
              <li><Link className="hover:text-white" to="/courses">Cours</Link></li>
              <li><Link className="hover:text-white" to="/about">A propos</Link></li>
              <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-secondary-100/85">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <a href={mapUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                  {centerAddress}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="flex-shrink-0" />
                <span>+212 5 22 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="flex-shrink-0" />
                <span>contact@freshstart.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-700/60 text-sm text-secondary-100/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>&copy; {currentYear} Fresh Start Academy. Tous droits reserves.</p>
          <p>Design system Sapphire + Navy</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
