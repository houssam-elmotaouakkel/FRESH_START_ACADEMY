import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const points = t('landing.about.points', { returnObjects: true });

  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-vis reveal-l">
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80"
            alt="Fresh Start Academy"
          />
          <div className="about-overlay">
            <strong>{t('landing.about.overlayTitle')}</strong>
            <span>{t('landing.about.overlaySub')}</span>
          </div>
          <div className="about-stripe" />
        </div>

        <div className="reveal-r">
          <div className="s-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span>{t('landing.about.tag')}</span>
          </div>
          <h2 className="s-title">
            {t('landing.about.titlePre')}<em>{t('landing.about.titleEm')}</em>{t('landing.about.titlePost')}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ts)', lineHeight: 1.7, marginBottom: '22px' }}>
            {t('landing.about.body')}
          </p>
          <ul className="about-list">
            {points.map((p, i) => (
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
            {t('landing.about.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
