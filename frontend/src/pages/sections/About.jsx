const POINTS = [
  'Professeurs expérimentés et passionnés',
  'Programmes adaptés à tous les âges et niveaux',
  'Petits groupes pour un suivi personnalisé',
  '100% de satisfaction garantie',
];

function About() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-vis reveal-l">
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80"
            alt="Cours particulier Fresh Start Academy"
          />
          <div className="about-overlay">
            <strong>Fresh Start Academy</strong>
            <span>Centre de soutien et de langues</span>
          </div>
          <div className="about-stripe" />
        </div>

        <div className="reveal-r">
          <div className="s-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span>À propos</span>
          </div>
          <h2 className="s-title">
            Votre partenaire de confiance <em>à Salé</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ts)', lineHeight: 1.7, marginBottom: '22px' }}>
            Fresh Start Academy est un centre linguistique et de soutien scolaire dirigé par une femme.
            Notre mission : accompagner chaque élève vers son plein potentiel, dans un environnement
            chaleureux et bienveillant.
          </p>
          <ul className="about-list">
            {POINTS.map((p, i) => (
              <li key={i}>
                <div className="a-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollTo('register')}
            className="btn-nav"
            style={{ fontSize: '15px', padding: '13px 24px' }}
          >
            S'inscrire maintenant →
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
