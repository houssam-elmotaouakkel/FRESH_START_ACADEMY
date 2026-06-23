import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stars from '../../components/ui/Stars';

// Avis Google authentiques — conservés dans leur langue d'origine (français).
const REVIEWS = [
  { initial: 'F', name: 'Faty', time: 'Il y a 7 mois', text: 'Le meilleur centre ! Je recommande vivement à tous.' },
  { initial: 'H', name: 'Hamza Nasir', time: 'Il y a 7 mois', text: 'Endroit magnifique, très bien organisé. Enseignement de haute qualité.' },
  { initial: 'S', name: 'Salma butterflies', time: 'Récemment', text: 'Vraiment le meilleur ! Les profs sont géniaux et l\'ambiance est top.', reply: 'Salma est la plus gentille élève ! Ma chérie 🧡✨' },
  { initial: 'Y', name: 'Youssef M.', time: 'Il y a 3 mois', text: 'J\'ai appris l\'allemand A1 en 3 mois. Les cours sont super bien structurés.', reply: 'Merci Youssef ! Tu as travaillé dur et ça se voit 🎉' },
  { initial: 'M', name: 'Meryem Alaoui', time: 'Il y a 2 mois', text: 'Le soutien scolaire a vraiment aidé mon fils. Ses notes ont considérablement amélioré.' },
  { initial: 'K', name: 'Karim B.', time: 'Il y a 1 mois', text: 'Atmosphère chaleureuse. Je suis venu pour l\'anglais et je reviens pour l\'allemand !', reply: 'Merci Karim, on t\'attend avec plaisir ! 🙏' },
];

const PER_PAGE = 3;

function Testimonials() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(REVIEWS.length / PER_PAGE) - 1;

  const visible = REVIEWS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="testimonials">
      <div className="s-inner">
        <div className="center reveal">
          <div className="s-tag" style={{ justifyContent: 'center' }}>
            <Stars count={1} size={13} /> <span>{t('landing.testimonials.tag')}</span>
          </div>
          <h2 className="s-title">
            {t('landing.testimonials.titlePre')}<em>{t('landing.testimonials.titleEm')}</em>{t('landing.testimonials.titlePost')}
          </h2>
          <p className="s-sub" style={{ margin: '0 auto 32px' }}>
            {t('landing.testimonials.subtitle')}
          </p>
        </div>

        <div className="rating-banner reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div className="rating-big">5.0</div>
            <div className="r-details">
              <div className="r-stars"><Stars size={18} /></div>
              <div className="r-count">{t('landing.testimonials.ratingCount')}</div>
            </div>
          </div>
          <div className="g-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>{t('landing.testimonials.googleVerified')}</span>
          </div>
        </div>

        <div className="carousel-wrap reveal">
          <div className="car-track">
            {visible.map((r, i) => (
              <div key={i} className="t-card">
                <div className="t-head">
                  <div className="av">{r.initial}</div>
                  <div>
                    <div className="t-name">{r.name}</div>
                    <div className="t-time">{r.time}</div>
                  </div>
                </div>
                <div className="t-stars"><Stars size={14} /></div>
                <p className="t-txt">"{r.text}"</p>
                {r.reply && (
                  <div className="o-reply">
                    <strong>{t('landing.testimonials.ownerReply')}</strong>
                    {r.reply}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="car-controls">
            <button className="car-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} aria-label={t('landing.testimonials.prev')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="car-dots">
              {Array.from({ length: maxPage + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`c-dot${i === page ? ' active' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={t('landing.testimonials.page', { n: i + 1 })}
                  aria-current={i === page}
                />
              ))}
            </div>
            <button className="car-btn" onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage} aria-label={t('landing.testimonials.next')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
