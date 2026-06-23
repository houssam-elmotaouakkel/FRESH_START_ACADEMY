import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null);
  const items = t('landing.faq.items', { returnObjects: true });

  return (
    <section id="faq">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="center">
          <div className="s-tag reveal" style={{ justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{t('landing.faq.tag')}</span>
          </div>
          <h2 className="s-title reveal">
            {t('landing.faq.titlePre')}<em>{t('landing.faq.titleEm')}</em>{t('landing.faq.titlePost')}
          </h2>
          <p className="s-sub reveal" style={{ margin: '0 auto 40px' }}>
            {t('landing.faq.subtitle')}
          </p>
        </div>

        <div className="faq-list">
          {items.map((f, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-ans-${i}`}
                id={`faq-q-${i}`}
              >
                <h4>{f.q}</h4>
                <div className="faq-arr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              <div
                className="faq-ans"
                id={`faq-ans-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                style={{ maxHeight: open === i ? '300px' : '0' }}
              >
                <div className="faq-ans-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
