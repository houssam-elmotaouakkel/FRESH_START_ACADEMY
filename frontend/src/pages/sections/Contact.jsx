const HOURS = [
  { day: 'Lundi', time: '9h00 – 19h00' },
  { day: 'Mardi', time: '9h00 – 19h00' },
  { day: 'Mercredi', time: '9h00 – 19h00' },
  { day: 'Jeudi', time: '9h00 – 19h00' },
  { day: 'Vendredi', time: '9h00 – 19h00' },
  { day: 'Samedi', time: '9h00 – 17h00' },
  { day: 'Dimanche', closed: true },
];

const MAPS_URL = 'https://maps.app.goo.gl/bxcavUfVyUPEpcDt7';

function Contact() {
  return (
    <section id="contact">
      <div className="s-inner">
        <div className="center">
          <div className="s-tag reveal" style={{ justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Contact</span>
          </div>
          <h2 className="s-title reveal">Visitez-nous ou <em>contactez-nous</em></h2>
          <p className="s-sub reveal" style={{ margin: '0 auto 48px' }}>
            Nous sommes à votre disposition pour répondre à toutes vos questions.
          </p>
        </div>

        <div className="contact-grid">
          <div>
            <div className="c-cards">
              {[
                { label: 'Appels', value: '07 14 26 04 53', href: 'tel:0714260453', type: 'phone' },
                { label: 'WhatsApp & Appels', value: '07 15 81 16 51', href: 'tel:0715811651', type: 'phone' },
                { label: 'Adresse', value: '76, Lot Al Majid II, Hay Chmaou, Salé', type: 'pin' },
                { label: 'Email', value: 'Freshstartacademy12@gmail.com', href: 'mailto:Freshstartacademy12@gmail.com', type: 'mail' },
              ].map((c, i) => (
                <div key={i} className={`c-card reveal d${i}`}>
                  <div className="c-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {c.type === 'phone' && <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.4 2.16 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />}
                      {c.type === 'pin' && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>}
                      {c.type === 'mail' && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>}
                    </svg>
                  </div>
                  <div>
                    <h4>{c.label}</h4>
                    {c.href ? <a href={c.href}>{c.value}</a> : <p>{c.value}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="hrs-card" style={{ marginTop: '14px' }}>
              <div className="hrs-hdr">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h4>Horaires d'ouverture</h4>
              </div>
              {HOURS.map((h, i) => (
                <div key={i} className="hrs-row">
                  <span className="day">{h.day}</span>
                  {h.closed ? <span className="closed">Fermé</span> : <span className="time">{h.time}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-r">
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.8!2d-6.8088481!3d34.0583352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7693b0778ec5d%3A0xd1f9e12a66ae2f56!2sFresh%20Start%20Academy!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fresh Start Academy - Salé, Maroc"
              />
            </div>
            <div className="map-acts">
              <a href="https://www.google.com/maps/dir/?api=1&destination=34.0583352,-6.8088481" target="_blank" rel="noopener noreferrer" className="map-btn map-btn-p">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Obtenir l'itinéraire
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="map-btn map-btn-s">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Trouver sur Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
