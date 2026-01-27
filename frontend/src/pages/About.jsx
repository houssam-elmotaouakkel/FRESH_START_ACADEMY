import { Link } from 'react-router-dom';
import {
  FaGraduationCap,
  FaUsers,
  FaGlobe,
  FaAward,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaRocket
} from 'react-icons/fa';

export default function About() {
  const stats = [
    { value: '10+', label: 'Années d\'expérience' },
    { value: '50+', label: 'Cours disponibles' },
    { value: '2000+', label: 'Étudiants formés' },
    { value: '95%', label: 'Taux de satisfaction' }
  ];

  const values = [
    {
      icon: FaHeart,
      title: 'Passion',
      description: 'Nous sommes passionnés par l\'enseignement des langues et la transmission du savoir.'
    },
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description: 'Nous utilisons des méthodes pédagogiques modernes et des technologies de pointe.'
    },
    {
      icon: FaHandshake,
      title: 'Engagement',
      description: 'Nous nous engageons à accompagner chaque étudiant vers la réussite.'
    },
    {
      icon: FaRocket,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans tous les aspects de notre enseignement.'
    }
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Directrice pédagogique',
      bio: '15 ans d\'expérience dans l\'enseignement des langues'
    },
    {
      name: 'Pierre Martin',
      role: 'Responsable des cours d\'anglais',
      bio: 'Professeur certifié Cambridge'
    },
    {
      name: 'Sofia García',
      role: 'Responsable des cours d\'espagnol',
      bio: 'Native de Madrid, 10 ans d\'expérience'
    },
    {
      name: 'Hans Müller',
      role: 'Responsable des cours d\'allemand',
      bio: 'Docteur en linguistique, native de Berlin'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de Fresh Start Academy
            </h1>
            <p className="text-xl text-primary-100">
              Depuis plus de 10 ans, nous aidons des milliers d'étudiants à réaliser 
              leur rêve de parler une nouvelle langue. Découvrez notre histoire et notre équipe.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fresh Start Academy a été fondée en 2015 avec une mission simple : 
                  rendre l'apprentissage des langues accessible, efficace et agréable 
                  pour tous.
                </p>
                <p>
                  Tout a commencé lorsque notre fondatrice, après avoir appris 5 langues 
                  étrangères, a réalisé que les méthodes traditionnelles d'enseignement 
                  ne répondaient pas aux besoins des apprenants modernes.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers d'avoir accompagné plus de 2000 étudiants 
                  dans leur parcours linguistique, avec des cours dans plus de 10 langues 
                  différentes.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Notre équipe"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">2015</div>
                <div>Année de création</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre enseignement et notre relation avec nos étudiants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi nous choisir ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaUsers,
                title: 'Professeurs natifs',
                description: 'Tous nos professeurs sont des locuteurs natifs qualifiés et passionnés.'
              },
              {
                icon: FaGlobe,
                title: 'Méthode immersive',
                description: 'Apprenez comme si vous viviez dans le pays de la langue étudiée.'
              },
              {
                icon: FaGraduationCap,
                title: 'Certificats reconnus',
                description: 'Obtenez des certifications valorisées sur le marché du travail.'
              },
              {
                icon: FaAward,
                title: 'Petits groupes',
                description: 'Maximum 12 étudiants par classe pour un suivi personnalisé.'
              },
              {
                icon: FaRocket,
                title: 'Flexibilité',
                description: 'Cours en présentiel ou en ligne, adaptés à votre emploi du temps.'
              },
              {
                icon: FaHeart,
                title: 'Accompagnement',
                description: 'Un suivi personnalisé tout au long de votre parcours.'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-primary-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre équipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des professionnels passionnés dédiés à votre réussite
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prêt à commencer votre aventure linguistique ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez notre communauté d'apprenants et découvrez une nouvelle façon 
            d'apprendre les langues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Découvrir nos cours
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
