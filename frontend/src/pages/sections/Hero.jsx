function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="hero-bg" />
      <div className="hero-dots" />
      <div className="hero-glow" />
      <div className="hero-inner">
        <div className="hero-content reveal">
          <h1 className="hero-title">Fresh Start</h1>
          <span className="hero-accent">Academy</span>
          <p className="hero-ar">Centre de soutien et de langues</p>
          <p className="hero-sub">
            Votre passerelle vers la maîtrise des langues et l'excellence académique à Salé, Maroc.
          </p>
          <div className="hero-acts">
            <button onClick={() => scrollTo('services')} className="btn-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Nos cours
            </button>
            <a href="tel:0714260453" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.4 2.16 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              07 14 26 04 53
            </a>
          </div>
          <div className="hero-rating">
            ⭐⭐⭐⭐⭐ &nbsp;<strong>5.0</strong>&nbsp;·&nbsp;31+ avis 5 étoiles
          </div>
        </div>

        <div className="hero-img-panel reveal-r">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=960&q=80"
            alt="Fresh Start Academy - Salle de cours"
          />
          <div className="hero-img-badge">
            <strong>Salles Modernes</strong>
            <span>Apprentissage interactif</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
