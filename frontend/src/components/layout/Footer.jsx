import { useTranslation } from 'react-i18next';
import { FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const contactLinkStyle = { display: 'inline-flex', alignItems: 'center', gap: '8px' };

function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { id: 'home', label: t('landing.nav.home') },
    { id: 'services', label: t('landing.nav.services') },
    { id: 'pricing', label: t('landing.nav.pricing') },
    { id: 'about', label: t('landing.nav.about') },
    { id: 'faq', label: t('landing.nav.faq') },
    { id: 'register', label: t('landing.nav.register') },
  ];

  return (
    <>
      {/* WhatsApp button */}
      <a
        href="https://wa.me/212715811651"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        title={t('landing.footer.whatsappTitle')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Scroll to top */}
      <button
        id="scrollTop"
        className="scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('landing.footer.scrollTop')}
      >
        <svg viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      <footer className="fsa-footer">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">
              <div className="foot-logo-icon">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <strong>Fresh Start Academy</strong>
            </div>
            <p className="foot-desc">{t('landing.footer.desc')}</p>
          </div>

          <div className="foot-col">
            <h5>{t('landing.footer.navTitle')}</h5>
            <ul>
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => goTo(l.id)}>{`› ${l.label}`}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>{t('landing.footer.contactTitle')}</h5>
            <ul>
              <li><a href="tel:0714260453" style={contactLinkStyle}><FiPhone size={15} /> 07 14 26 04 53 {t('landing.footer.callsLabel')}</a></li>
              <li><a href="tel:0715811651" style={contactLinkStyle}><FiPhone size={15} /> 07 15 81 16 51 {t('landing.footer.callsLabel')}</a></li>
              <li><a href="https://wa.me/212715811651" target="_blank" rel="noopener noreferrer" style={contactLinkStyle}><FaWhatsapp size={16} /> 07 15 81 16 51 {t('landing.footer.whatsappLabel')}</a></li>
              <li><a href="https://maps.app.goo.gl/bxcavUfVyUPEpcDt7" target="_blank" rel="noopener noreferrer" style={contactLinkStyle}><FiMapPin size={15} /> {t('landing.footer.addressShort')}</a></li>
              <li><a href="mailto:Freshstartacademy12@gmail.com" style={contactLinkStyle}><FiMail size={15} /> {t('landing.contact.email')}</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bot">
          <span>{t('landing.footer.rights', { year: new Date().getFullYear() })}</span>
          <span>{t('landing.footer.tagline')}</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
