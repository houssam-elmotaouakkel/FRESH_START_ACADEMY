import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import HeroSplit from '../components/branding/HeroSplit';
import LanguageSlices from '../components/branding/LanguageSlices';
import LocationMap from '../components/branding/LocationMap';
import courseService from '../services/courseService';
import testimonialService from '../services/testimonialService';
import { formatPrice } from '../utils/helpers';
import { COURSE_LEVELS } from '../utils/constants';

function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [courseResponse, testimonialResponse] = await Promise.all([
          courseService.getAllCourses({ limit: 3, isActive: true }),
          testimonialService.getApproved(3),
        ]);

        setFeaturedCourses(courseResponse.data || []);
        setTestimonials(testimonialResponse.data || []);
      } catch (error) {
        console.warn('Home content fallback:', error);
      }
    };

    fetchContent();
  }, []);

  const highlights = [
    { icon: <FiUsers />, value: '500+', label: 'Etudiants formes' },
    { icon: <FiBookOpen />, value: '30+', label: 'Programmes actifs' },
    { icon: <FiAward />, value: '95%', label: 'Satisfaction eleves' },
  ];

  return (
    <div className="min-h-screen">
      <HeroSplit />

      <section className="content-wrap px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div key={item.label} className="card p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-900">{item.value}</p>
                <p className="text-sm text-secondary-700">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LanguageSlices />

      <section className="content-wrap px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-700 mb-2">Programmes</p>
            <h2 className="section-title">Cours populaires</h2>
            <p className="section-copy mt-2">Selection des cours les plus demandes</p>
          </div>
          <Link to="/courses" className="btn-secondary">
            Tous les cours
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredCourses.length === 0 ? (
            <div className="card p-8 md:col-span-3 text-center text-secondary-700">
              Les cours seront affiches ici apres chargement.
            </div>
          ) : (
            featuredCourses.map((course) => (
              <article key={course.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="chip">{COURSE_LEVELS[course.level] || course.level}</span>
                  <span className="text-primary-700 font-semibold">{formatPrice(course.price)}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">{course.title}</h3>
                <p className="text-secondary-700 text-sm mb-5 line-clamp-3">
                  {course.description}
                </p>
                <Link to={`/courses/${course.id}`} className="btn-primary w-full">
                  Voir le detail
                  <FiArrowRight />
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="content-wrap px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <LocationMap />

          <div className="card p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-700 mb-2">Temoignages</p>
            <h2 className="text-2xl font-bold text-primary-900 mb-5">Ils ont etudie chez nous</h2>

            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <p className="text-secondary-700">Les avis verifies apparaitront ici.</p>
              ) : (
                testimonials.map((testimonial, index) => (
                  <article key={testimonial.id || `${testimonial.author || 'item'}-${index}`} className="surface-soft p-5 border border-secondary-200/70">
                    <div className="flex items-center gap-1 text-warning-500 mb-3">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                    <p className="text-secondary-800 mb-3">&ldquo;{testimonial.content}&rdquo;</p>
                    <p className="font-semibold text-primary-900">
                      {testimonial.author || testimonial.name || 'Etudiant Fresh Start'}
                    </p>
                    <p className="text-sm text-secondary-700">{testimonial.role || 'Apprenant'}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrap px-4 pb-6">
        <div className="rounded-[30px] gradient-primary px-8 py-12 text-center text-white">
          <h2 className="section-title text-white mb-4">Pret a demarrer votre parcours linguistique ?</h2>
          <p className="max-w-2xl mx-auto text-white/85 mb-8">
            Prenez contact avec notre equipe et recevez un plan de formation adapte a votre niveau.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-secondary">
              S&apos;inscrire
            </Link>
            <Link to="/contact" className="btn-primary border-white/30">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
