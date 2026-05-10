import { useEffect, useRef } from 'react';

const STATS = [
  { target: 5, dec: 1, suffix: '', label: 'Note Google', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
  { target: 31, suffix: '+', label: 'Avis 5 étoiles', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></> },
  { target: 6, suffix: '+', label: 'Langues enseignées', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></> },
  { target: 100, suffix: '%', label: 'Satisfaction élèves', icon: <><path d="M9 12l2 2 4-4" /><path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z" /></> },
];

function animateCount(el, target, dec, suffix) {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = (dec ? val.toFixed(dec) : Math.round(val)) + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function Stats() {
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number(entry.target.dataset.idx);
            const { target, dec, suffix } = STATS[i];
            animateCount(entry.target, target, dec, suffix || '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-bar">
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className={`stat-item reveal d${i + 1}`}>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24">{s.icon}</svg>
            </div>
            <div className="stat-num" ref={(el) => (refs.current[i] = el)} data-idx={i}>
              0
            </div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
