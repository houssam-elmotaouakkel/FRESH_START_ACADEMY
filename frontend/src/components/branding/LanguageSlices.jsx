import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const slices = [
  {
    key: 'french',
    title: 'Francais',
    copy: 'Du niveau debutant au niveau avance',
    query: 'category=LANGUAGES',
  },
  {
    key: 'english',
    title: 'Anglais',
    copy: 'General, business et preparation examens',
    query: 'category=TRAINING',
  },
  {
    key: 'arabic',
    title: 'Arabe',
    copy: 'Cours moderne, oral, ecrit et communication',
    query: 'category=LANGUAGES',
  },
];

function LanguageSlices() {
  return (
    <section className="content-wrap px-4 py-16">
      <div className="rounded-[30px] overflow-hidden relative border border-primary-700/15 shadow-[0_20px_50px_rgba(0,9,38,0.18)]">
        <img
          src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80"
          alt="Etudiants en classe"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary-900/70" />

        <div className="relative grid md:grid-cols-3">
          {slices.map((slice, index) => (
            <div
              key={slice.key}
              className={`p-8 md:p-10 min-h-52 flex flex-col justify-between backdrop-blur-[1px] ${
                index !== slices.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/20' : ''
              }`}
              style={{
                background:
                  index === 1
                    ? 'linear-gradient(145deg, rgba(15,82,186,0.72), rgba(0,9,38,0.55))'
                    : 'linear-gradient(145deg, rgba(0,9,38,0.74), rgba(15,82,186,0.48))',
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-secondary-100/75 mb-3">
                  Langue
                </p>
                <h3 className="text-3xl font-bold text-white mb-3">{slice.title}</h3>
                <p className="text-secondary-100/90">{slice.copy}</p>
              </div>
              <Link
                to={`/courses?${slice.query}`}
                className="inline-flex items-center gap-2 text-white font-semibold mt-6 hover:text-secondary-100"
              >
                Voir les programmes
                <FiArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LanguageSlices;
