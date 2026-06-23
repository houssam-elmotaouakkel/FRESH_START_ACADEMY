import { useTranslation } from 'react-i18next';
import { FiGlobe, FiFlag, FiBookOpen } from 'react-icons/fi';

const PLAN_ICONS = [FiGlobe, FiFlag, FiBookOpen];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Pricing() {
  const { t } = useTranslation();
  const plans = t('landing.pricing.plans', { returnObjects: true });
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
            <span>{t('landing.pricing.tag')}</span>
          </div>
          <h2 className="s-title reveal">
            {t('landing.pricing.titlePre')}<em>{t('landing.pricing.titleEm')}</em>{t('landing.pricing.titlePost')}
          </h2>
          <p className="s-sub reveal" style={{ margin: '0 auto 48px' }}>
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        <div className="price-grid">
          {plans.map((p, i) => {
            const Icon = PLAN_ICONS[i] || FiGlobe;
            return (
              <div key={i} className={`price-card reveal d${i + 1}${p.badge ? ' feat' : ''}`}>
                {p.badge && <div className="p-badge">{p.badge}</div>}
                <div className="p-lang" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={15} aria-hidden="true" />
                  {p.lang}
                </div>
                <div className="p-name">{p.name}</div>
                <div className="p-price">
                  {p.price}{' '}
                  <span style={{ fontSize: '19px', fontWeight: 500, color: p.badge ? 'rgba(255,255,255,.6)' : 'var(--ts)' }}>
                    {t('landing.pricing.currency')}
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
                  {t('landing.pricing.cta')}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--ts)' }}>
          {t('landing.pricing.footnote')}
        </p>
      </div>
    </section>
  );
}

export default Pricing;
