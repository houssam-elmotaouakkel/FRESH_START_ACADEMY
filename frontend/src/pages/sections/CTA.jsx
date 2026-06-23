import { useTranslation } from 'react-i18next';

function CTA() {
  const { t } = useTranslation();

  return (
    <section id="cta">
      <div className="cta-inner">
        <h2>{t('landing.cta.title')}</h2>
        <p>{t('landing.cta.body')}</p>
        <div className="cta-acts">
          <a href="tel:0714260453" className="btn-cw">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.4 2.16 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            {t('landing.cta.call')}
          </a>
          <a
            href="https://maps.app.goo.gl/bxcavUfVyUPEpcDt7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-co"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t('landing.cta.directions')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
