import { Link } from 'react-router-dom'
import { FiBook, FiUsers, FiAward, FiGlobe, FiArrowRight, FiStar, FiCheck } from 'react-icons/fi'

function Home() {
  const features = [
    {
      icon: <FiBook className="w-8 h-8" />,
      title: 'Programmes Personnalisés',
      description: 'Des cours adaptés à votre niveau et vos objectifs d\'apprentissage.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Professeurs Qualifiés',
      description: 'Une équipe d\'enseignants natifs et expérimentés.'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Certifications Reconnues',
      description: 'Préparez vos examens officiels avec nos programmes certifiants.'
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'Cours en Ligne',
      description: 'Apprenez où vous voulez, quand vous voulez avec nos cours en ligne.'
    }
  ]

  const languages = [
    {
      name: 'Français',
      flag: '🇫🇷',
      description: 'Maîtrisez la langue de Molière avec nos cours de FLE.',
      levels: ['Débutant', 'Intermédiaire', 'Avancé']
    },
    {
      name: 'Anglais',
      flag: '🇬🇧',
      description: 'Développez vos compétences en anglais professionnel et courant.',
      levels: ['Débutant', 'Intermédiaire', 'Avancé']
    },
    {
      name: 'Arabe',
      flag: '🇲🇦',
      description: 'Apprenez l\'arabe moderne standard et dialectal.',
      levels: ['Débutant', 'Intermédiaire', 'Avancé']
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Étudiante en Français',
      content: 'Fresh Start Academy m\'a permis d\'atteindre le niveau B2 en seulement 6 mois. Les professeurs sont excellents !',
      rating: 5
    },
    {
      name: 'Karim B.',
      role: 'Professionnel',
      content: 'Grâce aux cours d\'anglais business, j\'ai obtenu une promotion. Je recommande vivement !',
      rating: 5
    },
    {
      name: 'Emma L.',
      role: 'Étudiante en Arabe',
      content: 'Une approche pédagogique moderne et efficace. J\'ai adoré mon expérience.',
      rating: 5
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Apprenez une Nouvelle Langue avec <span className="text-white">Fresh Start Academy</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Votre partenaire pour l'apprentissage du français, de l'anglais et de l'arabe.
              Des cours adaptés à tous les niveaux avec des professeurs qualifiés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="bg-white text-primary-300 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2">
                Découvrir nos cours
                <FiArrowRight />
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-300 transition-all">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-300">500+</p>
              <p className="text-gray-600">Étudiants</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-300">20+</p>
              <p className="text-gray-600">Professeurs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-300">15+</p>
              <p className="text-gray-600">Cours</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-300">98%</p>
              <p className="text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Pourquoi Choisir Fresh Start Academy ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous offrons une expérience d'apprentissage unique avec des méthodes modernes
              et un accompagnement personnalisé.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Nos Langues
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choisissez parmi nos trois langues et commencez votre parcours d'apprentissage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {languages.map((lang, index) => (
              <div key={index} className="card p-8 hover:shadow-xl">
                <div className="text-6xl mb-4">{lang.flag}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{lang.name}</h3>
                <p className="text-gray-600 mb-6">{lang.description}</p>
                <div className="space-y-2 mb-6">
                  {lang.levels.map((level, i) => (
                    <div key={i} className="flex items-center text-gray-600">
                      <FiCheck className="text-primary-300 mr-2" />
                      {level}
                    </div>
                  ))}
                </div>
                <Link
                  to="/courses"
                  className="btn-primary w-full text-center"
                >
                  Voir les cours
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Ce que disent nos étudiants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos étudiants satisfaits.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-primary-300">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous dès maintenant et bénéficiez d'une première consultation gratuite.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-300 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            S'inscrire maintenant
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home