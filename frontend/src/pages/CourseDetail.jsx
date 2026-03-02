import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiUsers,
  FiBarChart,
  FiCalendar,
  FiCheck,
  FiArrowLeft,
  FiShoppingCart,
} from 'react-icons/fi';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import useAuthStore from '../store/authStore';
import { formatPrice } from '../utils/helpers';
import { COURSE_LEVELS, COURSE_CATEGORIES } from '../utils/constants';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await courseService.getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Cours non trouve');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const checkEnrollment = useCallback(async () => {
    try {
      const response = await enrollmentService.getMyEnrollments();
      const enrolled = response.data?.some((entry) => entry.course?.id === id);
      setIsEnrolled(Boolean(enrolled));
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [fetchCourse, checkEnrollment, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour vous inscrire');
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enroll(id);
      toast.success('Inscription reussie');
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l inscription');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!course) return null;

  const infoCards = [
    {
      icon: <FiCalendar />,
      label: 'Prochaine session',
      value: course.startDate ? new Date(course.startDate).toLocaleDateString('fr-FR') : 'A confirmer',
    },
    {
      icon: <FiBarChart />,
      label: 'Niveau',
      value: COURSE_LEVELS[course.level] || course.level,
    },
    {
      icon: <FiClock />,
      label: 'Duree',
      value: `${course.duration || 0} heures`,
    },
    {
      icon: <FiUsers />,
      label: 'Places',
      value: course.maxStudents ? `${course.maxStudents} max` : 'Illimite',
    },
  ];

  const mobileCtaVisible = !isEnrolled && course.isActive;

  return (
    <div className="min-h-screen bg-secondary-50">
      <section className="gradient-primary text-white">
        <div className="content-wrap px-4 py-14">
          <Link to="/courses" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-5">
            <FiArrowLeft />
            Retour aux cours
          </Link>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="chip bg-white/15 text-white border border-white/30">
                {COURSE_CATEGORIES[course.category] || course.category}
              </span>
              <span className="chip bg-white/15 text-white border border-white/30">
                {COURSE_LEVELS[course.level] || course.level}
              </span>
            </div>
            <h1 className="section-title text-white mb-4">{course.title}</h1>
            <p className="text-white/85 text-lg">{course.description}</p>
          </div>
        </div>
      </section>

      <section className="content-wrap px-4 py-10 grid lg:grid-cols-3 gap-8 pb-24 lg:pb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Apercu rapide</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {infoCards.map((item) => (
                <div key={item.label} className="rounded-2xl border border-secondary-200 bg-secondary-50 p-4">
                  <div className="w-9 h-9 rounded-full gradient-primary text-white flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <p className="text-sm text-secondary-700">{item.label}</p>
                  <p className="font-semibold text-primary-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {course.content && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Contenu du programme</h2>
              <p className="text-secondary-800 whitespace-pre-line">{course.content}</p>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Ce que vous allez maitriser</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                'Communication orale et ecrite',
                'Grammaire utile et vocabulaire actif',
                'Comprehension audio',
                'Preparation examens et certifications',
                'Simulations pratiques',
                'Methode personnalisee',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-secondary-800">
                  <FiCheck className="text-success-500 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <p className="text-sm text-secondary-700 mb-1">Tarif</p>
            <p className="text-4xl font-bold text-primary-700 mb-4">{formatPrice(course.price)}</p>
            <p className="text-sm text-secondary-700 mb-6">
              {course.duration ? `${course.duration} heures de formation` : 'Format adaptable'}
            </p>

            {isEnrolled ? (
              <div className="rounded-2xl bg-success-500/10 text-success-600 p-4 text-center">
                <FiCheck className="mx-auto mb-2" />
                <p className="font-semibold mb-3">Vous etes deja inscrit</p>
                <Link to="/my-enrollments" className="btn-secondary w-full">
                  Voir mes inscriptions
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling || !course.isActive}
                className="btn-primary w-full"
              >
                {enrolling ? 'Inscription en cours...' : !course.isActive ? 'Cours indisponible' : (
                  <>
                    <FiShoppingCart />
                    S inscrire maintenant
                  </>
                )}
              </button>
            )}

            <div className="mt-6 pt-5 border-t border-secondary-200">
              <h3 className="font-semibold text-primary-900 mb-3">Inclus dans le cours</h3>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-center gap-2"><FiCheck className="text-primary-700" /> Support pedagogique</li>
                <li className="flex items-center gap-2"><FiCheck className="text-primary-700" /> Exercices pratiques</li>
                <li className="flex items-center gap-2"><FiCheck className="text-primary-700" /> Suivi personnalise</li>
                <li className="flex items-center gap-2"><FiCheck className="text-primary-700" /> Certificat final</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      {mobileCtaVisible && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-secondary-200 bg-white/95 backdrop-blur px-4 py-3 z-40">
          <button
            type="button"
            onClick={handleEnroll}
            disabled={enrolling}
            className="btn-primary w-full"
          >
            {enrolling ? 'Inscription en cours...' : (
              <>
                <FiShoppingCart />
                S inscrire maintenant - {formatPrice(course.price)}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
