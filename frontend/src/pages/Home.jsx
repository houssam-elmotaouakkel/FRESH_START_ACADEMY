import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
    { icon: <FiUsers />, value: '500+', label: t('home.highlights.teachers') },
    { icon: <FiBookOpen />, value: '30+', label: t('home.highlights.groups') },
    { icon: <FiAward />, value: '95%', label: t('home.highlights.certificate') },
  ];

  return (
    <div className="min-h-screen">
      <HeroSplit />

      <section className="content-wrap px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div key={item.label} className="card p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary-100 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-900 dark:text-white">{item.value}</p>
                <p className="text-sm text-secondary-700 dark:text-secondary-300">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LanguageSlices />

      <section className="content-wrap px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary-700 dark:text-primary-300 mb-2">{t('common.courses')}</p>
            <h2 className="section-title">{t('home.ourCourses')}</h2>
            <p className="section-copy mt-2">{t('courses.title')}</p>
          </div>
          <Link to="/courses" className="btn-secondary">
            {t('home.seeAllCourses')}
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredCourses.length === 0 ? (
            <div className="card p-8 md:col-span-3 text-center text-secondary-700 dark:text-secondary-300">
              {t('common.loading')}
            </div>
          ) : (
            featuredCourses.map((course) => (
              <article key={course.id} className="card card-interactive p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="chip">{COURSE_LEVELS[course.level] || course.level}</span>
                  <span className="text-primary-700 dark:text-primary-300 font-semibold">{formatPrice(course.price)}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-3">{course.title}</h3>
                <p className="text-secondary-700 dark:text-secondary-300 text-sm mb-5 line-clamp-3">
                  {course.description}
                </p>
                <Link to={`/courses/${course.id}`} className="btn-primary w-full">
                  {t('courses.description')}
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
            <p className="text-xs uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300 mb-2">{t('testimonials.title')}</p>
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-5">{t('home.testimonials')}</h2>

            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <p className="text-secondary-700 dark:text-secondary-300">Les avis verifies apparaitront ici.</p>
              ) : (
                testimonials.map((testimonial, index) => (
                  <article key={testimonial.id || `${testimonial.author || 'item'}-${index}`} className="surface-soft p-5 border border-secondary-200/70 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-warning-500 mb-3">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                    <p className="text-secondary-800 dark:text-secondary-100 mb-3">&ldquo;{testimonial.content}&rdquo;</p>
                    <p className="font-semibold text-primary-900 dark:text-white">
                      {testimonial.author || testimonial.name || 'Etudiant Fresh Start'}
                    </p>
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">{testimonial.role || 'Apprenant'}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrap px-4 pb-6">
        <div className="rounded-[30px] gradient-primary px-8 py-12 text-center text-white">
          <h2 className="section-title text-white mb-4">{t('hero.title')}</h2>
          <p className="max-w-2xl mx-auto text-white/85 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-secondary">
              {t('common.register')}
            </Link>
            <Link to="/contact" className="btn-primary border-white/30">
              {t('common.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
