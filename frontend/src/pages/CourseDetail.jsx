import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiClock,
  FiUsers,
  FiBarChart,
  FiCalendar,
  FiCheck,
  FiArrowLeft,
  FiShoppingCart
} from 'react-icons/fi'
import courseService from '../services/courseService'
import enrollmentService from '../services/enrollmentService'
import useAuthStore from '../store/authStore'
import { formatPrice } from '../utils/helpers'
import { COURSE_LEVELS, COURSE_CATEGORIES } from '../utils/constants'

function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const fetchCourse = useCallback(async () => {
    try {
      const response = await courseService.getCourseById(id)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Cours non trouvé')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  const checkEnrollment = useCallback(async () => {
    try {
      const response = await enrollmentService.getMyEnrollments()
      const enrolled = response.data.enrollments?.some(e => e.courseId === parseInt(id))
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }, [id])

  useEffect(() => {
    fetchCourse()
    if (isAuthenticated) {
      checkEnrollment()
    }
  }, [fetchCourse, checkEnrollment, isAuthenticated])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour vous inscrire')
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }

    setEnrolling(true)
    try {
      await enrollmentService.enroll(parseInt(id))
      toast.success('Inscription réussie !')
      setIsEnrolled(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  const features = [
    { icon: <FiClock />, label: 'Durée', value: `${course.duration || 0}h` },
    { icon: <FiBarChart />, label: 'Niveau', value: COURSE_LEVELS[course.level] || course.level },
    { icon: <FiUsers />, label: 'Places', value: course.maxStudents ? `${course.maxStudents} max` : 'Illimité' },
    { icon: <FiCalendar />, label: 'Catégorie', value: COURSE_CATEGORIES[course.category] || course.category }
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <section className="gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <FiArrowLeft />
            Retour aux cours
          </Link>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {COURSE_CATEGORIES[course.category] || course.category}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {COURSE_LEVELS[course.level] || course.level}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">{course.title}</h1>
            <p className="text-xl text-white/90">{course.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Informations du cours</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        {feature.icon}
                      </div>
                      <p className="text-sm text-secondary-600">{feature.label}</p>
                      <p className="font-semibold text-gray-800">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {course.content && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Contenu du cours</h2>
                  <div className="prose max-w-none text-secondary-700">
                    {course.content}
                  </div>
                </div>
              )}

              {/* What you'll learn */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Ce que vous apprendrez</h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    'Communication orale et écrite',
                    'Grammaire et vocabulaire',
                    'Compréhension audio',
                    'Expression fluide',
                    'Culture et traditions',
                    'Préparation aux examens'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FiCheck className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary-500 mb-2">
                    {formatPrice(course.price)}
                  </p>
                  {course.duration && (
                    <p className="text-secondary-600">{course.duration} heures de cours</p>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="text-center">
                    <div className="bg-success-500/10 text-success-600 p-4 rounded-xl mb-4">
                      <FiCheck className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Vous êtes inscrit à ce cours</p>
                    </div>
                    <Link to="/my-enrollments" className="btn-secondary w-full">
                      Voir mes inscriptions
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || !course.isActive}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      'Inscription en cours...'
                    ) : !course.isActive ? (
                      'Cours indisponible'
                    ) : (
                      <>
                        <FiShoppingCart />
                        S'inscrire maintenant
                      </>
                    )}
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Ce cours inclut :</h3>
                  <ul className="space-y-2 text-sm text-secondary-600">
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-primary-500" />
                      Accès à vie au contenu
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-primary-500" />
                      Support pédagogique
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-primary-500" />
                      Certificat de fin de formation
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-primary-500" />
                      Exercices pratiques
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetail