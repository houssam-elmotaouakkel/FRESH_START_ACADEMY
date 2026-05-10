const SERVICES = [
  {
    popular: true,
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
    title: "Cours d'Allemand",
    desc: "Du niveau A1 au B2. Idéal pour l'immigration, les études ou le travail en Allemagne. Préparation Goethe incluse.",
    tags: [{ label: 'A1–B2', cls: 'tb' }, { label: 'Goethe Prep', cls: 'tb' }, { label: 'Conversation', cls: 'tb' }],
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
    title: "Cours d'Anglais",
    desc: "Approche communicative du débutant à l'avancé. Préparation IELTS et TOEFL disponible.",
    tags: [{ label: 'Général', cls: 'tb' }, { label: 'Business', cls: 'tb' }, { label: 'IELTS', cls: 'tb' }],
  },
  {
    icon: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></>,
    title: 'Cours de Français',
    desc: 'Renforcez votre français pour la réussite académique et professionnelle. Préparation DELF/DALF.',
    tags: [{ label: 'Tous niveaux', cls: 'tg' }, { label: 'DELF/DALF', cls: 'tg' }, { label: 'Scolaire', cls: 'tg' }],
  },
  {
    icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    title: 'Soutien Scolaire',
    desc: 'Cours particuliers du primaire au lycée. Toutes les matières, en arabe ou en français.',
    tags: [{ label: 'Toutes matières', cls: 'tb' }, { label: 'Devoirs', cls: 'tb' }, { label: 'Examens', cls: 'tb' }],
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    title: 'Groupe & Privés',
    desc: 'Sessions interactives en groupe ou cours individuels personnalisés selon votre rythme.',
    tags: [{ label: 'Flexible', cls: 'tb' }, { label: 'Rythme perso', cls: 'tb' }, { label: 'Suivi régulier', cls: 'tb' }],
  },
  {
    popular: true,
    icon: <><path d="M9 12l2 2 4-4" /><path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z" /></>,
    title: 'Immigration & Visa',
    desc: "Cours d'allemand spéciaux pour les démarches de visa. Préparation aux tests d'intégration.",
    tags: [{ label: 'Goethe-Zertifikat', cls: 'tg' }, { label: 'Intégration', cls: 'tg' }, { label: 'Visa', cls: 'tg' }],
  },
];

function Services() {
  return (
    <section id="services">
      <div className="s-inner">
        <div className="s-tag reveal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
          <span>Nos Formations</span>
        </div>
        <h2 className="s-title reveal">
          Des cours adaptés à <em>votre</em> réussite
        </h2>
        <p className="s-sub reveal">
          Programmes complets pour atteindre vos objectifs linguistiques et académiques.
        </p>
        <div className="srv-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className={`srv-card reveal d${(i % 3) + 1}`}>
              {s.popular && <span className="pop-badge">Populaire</span>}
              <div className="srv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{s.icon}</svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="tags">
                {s.tags.map((t, j) => (
                  <span key={j} className={`tag ${t.cls}`}>{t.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
