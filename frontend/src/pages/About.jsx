import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiTarget, FiArrowRight } from 'react-icons/fi';

const values = [
  {
    title: 'Pedagogie claire',
    copy: 'Methodes concretes, progression mesuree et exercices appliques.',
    icon: <FiBook />,
  },
  {
    title: 'Suivi humain',
    copy: 'Chaque apprenant est suivi avec des points de progression reguliers.',
    icon: <FiUsers />,
  },
  {
    title: 'Objectif resultat',
    copy: 'Nous alignons le programme sur vos besoins et vos contraintes.',
    icon: <FiTarget />,
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="gradient-primary text-white">
        <div className="content-wrap px-4 py-14 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-secondary-100/85 mb-2">A propos</p>
            <h1 className="section-title text-white mb-4">Un centre de langues axe sur la progression reelle</h1>
            <p className="text-white/85 max-w-xl">
              Fresh Start Academy accompagne etudiants, adultes et professionnels qui
              veulent apprendre vite et bien, avec un cadre structurant et motivant.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="Equipe pedagogique"
            className="rounded-3xl border border-white/30 shadow-2xl h-72 w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <section className="content-wrap px-4 py-12 grid md:grid-cols-3 gap-5">
        {values.map((value) => (
          <article key={value.title} className="card p-6">
            <div className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center mb-4">
              {value.icon}
            </div>
            <h2 className="text-xl font-semibold text-primary-900 mb-2">{value.title}</h2>
            <p className="text-secondary-700">{value.copy}</p>
          </article>
        ))}
      </section>

      <section className="content-wrap px-4 pb-6">
        <div className="card p-8 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary-900 mb-4">Notre mission</h2>
            <p className="text-secondary-700 mb-4">
              Aider chaque apprenant a gagner en confiance et autonomie dans une langue
              etrangere, avec un encadrement exigeant et bienveillant.
            </p>
            <p className="text-secondary-700">
              Nos cours sont disponibles en sessions regulieres, intensives et weekend
              pour s adapter a votre rythme.
            </p>
          </div>
          <div className="surface-soft p-7 border border-secondary-200/70">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Pret a rejoindre Fresh Start ?</h3>
            <p className="text-secondary-700 mb-5">
              Choisissez votre langue et obtenez un plan de progression concret.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary">
                Voir les cours
                <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn-secondary">Parler a un conseiller</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
