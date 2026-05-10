const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PLANS = [
  {
    lang: '🌍 Anglais / Français',
    name: 'Essentiel',
    price: '400',
    period: '/ mois · 8 séances',
    features: ['2 séances / semaine', 'Groupe (max 8 élèves)', 'Matériel inclus', 'Suivi mensuel'],
  },
  {
    featured: true,
    badge: 'Meilleur choix',
    lang: '🇩🇪 Allemand A1–B2',
    name: 'Intensif',
    price: '600',
    period: '/ mois · 12 séances',
    features: ['3 séances / semaine', 'Groupe réduit (max 6)', 'Matériel inclus', 'Préparation Goethe', 'Certificat de niveau'],
  },
  {
    lang: '📚 Soutien Scolaire',
    name: 'Privé',
    price: '150',
    period: '/ séance individuelle',
    features: ['Cours 1-sur-1', 'Horaires flexibles', 'Programme sur mesure', 'Toutes matières'],
  },
];

function Pricing() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="pricing">
      <div className="s-inner">
        <div className="center">
          <div className="s-tag reveal" style={{ justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span>Tarifs &amp; Niveaux</span>
          </div>
          <h2 className="s-title reveal">
            Des formules pour <em>tous les budgets</em>
          </h2>
          <p className="s-sub reveal" style={{ margin: '0 auto 48px' }}>
            Matériel pédagogique inclus dans toutes les formules. Contactez-nous pour un devis personnalisé.
          </p>
        </div>

        <div className="price-grid">
          {PLANS.map((p, i) => (
            <div key={i} className={`price-card reveal d${i + 1}${p.featured ? ' feat' : ''}`}>
              {p.badge && <div className="p-badge">{p.badge}</div>}
              <div className="p-lang">{p.lang}</div>
              <div className="p-name">{p.name}</div>
              <div className="p-price">
                {p.price}{' '}
                <span style={{ fontSize: '19px', fontWeight: 500, color: p.featured ? 'rgba(255,255,255,.6)' : 'var(--ts)' }}>
                  MAD
                </span>
              </div>
              <div className="p-period">{p.period}</div>
              <div className="p-div" />
              <ul className="p-feats">
                {p.features.map((f, j) => (
                  <li key={j}>
                    <div className="p-check"><CheckIcon /></div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollTo('register')} className="btn-price">
                Commencer
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--ts)' }}>
          * Tarifs indicatifs. Contactez-nous pour un devis personnalisé.
        </p>
      </div>
    </section>
  );
}

export default Pricing;
