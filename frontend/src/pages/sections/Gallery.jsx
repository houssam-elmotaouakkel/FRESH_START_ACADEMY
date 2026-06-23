import { useTranslation } from 'react-i18next';

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', tall: true },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80' },
  { url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&q=80' },
];

function Gallery() {
  const { t } = useTranslation();
  const items = t('landing.gallery.items', { returnObjects: true });

  return (
    <section id="gallery" style={{ background: 'var(--b9)' }}>
      <div className="s-inner">
        <div className="center reveal">
          <div className="s-tag" style={{ justifyContent: 'center', background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.9)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{t('landing.gallery.tag')}</span>
          </div>
          <h2 className="s-title" style={{ color: 'white' }}>
            {t('landing.gallery.titlePre')}<em style={{ color: 'var(--b4)' }}>{t('landing.gallery.titleEm')}</em>{t('landing.gallery.titlePost')}
          </h2>
          <p className="s-sub" style={{ color: 'rgba(255,255,255,.65)', margin: '0 auto 40px' }}>
            {t('landing.gallery.subtitle')}
          </p>
        </div>

        <div className="gal-grid">
          {IMAGES.map((img, i) => (
            <div key={i} className={`gal-item${img.tall ? ' tall' : ''} reveal${img.tall ? '-l' : ` d${i}`}`}>
              <img src={img.url} alt={items[i]?.title} />
              <div className="gal-overlay">
                <div>
                  <strong>{items[i]?.title}</strong>
                  <span>{items[i]?.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gal-bottom reveal">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80"
            alt="Fresh Start Academy"
          />
        </div>
      </div>
    </section>
  );
}

export default Gallery;
