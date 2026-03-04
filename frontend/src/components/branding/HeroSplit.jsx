import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const placeholderImages = [
  'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
];

function HeroSplit() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary-100/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-secondary-300/30 blur-2xl" />

      <div className="relative content-wrap px-4 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-secondary-100/90 mb-4">
            <FiMapPin />
            {t('header.subtitle')}
          </p>
          <h1 className="section-title text-white mb-5">
            Fresh Start Academy
          </h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-xl mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/courses" className="btn-secondary">
              {t('hero.cta')}
              <FiArrowRight />
            </Link>
            <Link to="/register" className="btn-primary border-white/20">
              {t('common.register')}
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/85">
            <span>+500 etudiants formes</span>
            <span>Classes en petits groupes</span>
            <span>Sessions intensives et weekend</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl lg:justify-self-end">
          <img
            src={placeholderImages[0]}
            alt="Salle de cours au centre"
            className="rounded-3xl h-64 w-full object-cover border border-white/30 shadow-2xl col-span-2"
            loading="lazy"
          />
          <img
            src={placeholderImages[1]}
            alt="Etudiants au centre de langues"
            className="rounded-3xl h-40 w-full object-cover border border-white/30 shadow-xl"
            loading="lazy"
          />
          <img
            src={placeholderImages[2]}
            alt="Formation en groupe"
            className="rounded-3xl h-40 w-full object-cover border border-white/30 shadow-xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSplit;
