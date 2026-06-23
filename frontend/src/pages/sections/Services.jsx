import { useTranslation } from 'react-i18next';

const ICONS = [
  <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
  <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
  <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></>,
  <><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
  <><path d="M9 12l2 2 4-4" /><path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z" /></>,
];
const POPULAR = [true, false, false, false, false, true];
const TAG_CLS = [
  ['tb', 'tb', 'tb'],
  ['tb', 'tb', 'tb'],
  ['tg', 'tg', 'tg'],
  ['tb', 'tb', 'tb'],
  ['tb', 'tb', 'tb'],
  ['tg', 'tg', 'tg'],
];

function Services() {
  const { t } = useTranslation();
  const items = t('landing.services.items', { returnObjects: true });

  return (
    <section id="services">
      <div className="s-inner">
        <div className="s-tag reveal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
          <span>{t('landing.services.tag')}</span>
        </div>
        <h2 className="s-title reveal">
          {t('landing.services.titlePre')}<em>{t('landing.services.titleEm')}</em>{t('landing.services.titlePost')}
        </h2>
        <p className="s-sub reveal">{t('landing.services.subtitle')}</p>
        <div className="srv-grid">
          {items.map((s, i) => (
            <div key={i} className={`srv-card reveal d${(i % 3) + 1}`}>
              {POPULAR[i] && <span className="pop-badge">{t('landing.services.popular')}</span>}
              <div className="srv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{ICONS[i]}</svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="tags">
                {s.tags.map((label, j) => (
                  <span key={j} className={`tag ${TAG_CLS[i][j]}`}>{label}</span>
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
