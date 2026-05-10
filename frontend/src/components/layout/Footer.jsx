const NAV_LINKS = [
  { id: 'home', label: '› Accueil' },
  { id: 'services', label: '› Services' },
  { id: 'pricing', label: '› Tarifs' },
  { id: 'about', label: '› À propos' },
  { id: 'faq', label: '› FAQ' },
  { id: 'register', label: "› S'inscrire" },
];

const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function Footer() {
  return (
    <>
      {/* WhatsApp button */}
      <a
        href="https://wa.me/212715811651"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        title="Contactez-nous sur WhatsApp"
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
        aria-label="Retour en haut"
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
            <p className="foot-desc">
              Centre linguistique et de soutien scolaire à Salé, Maroc. Dirigé par une femme, pour l'excellence de tous.
            </p>
          </div>

          <div className="foot-col">
            <h5>Navigation</h5>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => goTo(l.id)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:0714260453">📞 07 14 26 04 53 (Appels)</a></li>
              <li><a href="tel:0715811651">📞 07 15 81 16 51 (Appels)</a></li>
              <li><a href="https://wa.me/212715811651" target="_blank" rel="noopener noreferrer">💬 07 15 81 16 51 (WhatsApp)</a></li>
              <li><a href="https://maps.app.goo.gl/bxcavUfVyUPEpcDt7" target="_blank" rel="noopener noreferrer">📍 Salé, Maroc</a></li>
              <li><a href="mailto:Freshstartacademy12@gmail.com">✉ Email</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Fresh Start Academy. Tous droits réservés.</span>
          <span>Centre de soutien et de langues — Salé, Maroc</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
