import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBook, FiClock, FiAward, FiCalendar, FiArrowRight } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import enrollmentService from '../services/enrollmentService'
import { formatDate } from '../utils/helpers'

function Dashboard() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0
  })

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentService.getMyEnrollments()
      const data = response.data || []
      setEnrollments(data)
      
      setStats({
        totalCourses: data.length,
        inProgress: data.filter(e => e.status === 'CONFIRMED').length,
        completed: data.filter(e => e.status === 'COMPLETED').length
      })
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Cours inscrits',
      value: stats.totalCourses,
      color: 'bg-primary-500'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      label: 'En cours',
      value: stats.inProgress,
      color: 'bg-accent-500'
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      label: 'Complétés',
      value: stats.completed,
      color: 'bg-success-500'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {user?.firstName} ! 👋
          </h1>
          <p className="text-white/90">
            Bienvenue sur votre tableau de bord. Suivez votre progression et continuez à apprendre.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Enrollments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mes cours récents</h2>
            <Link
              to="/my-enrollments"
              className="text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              Voir tout <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8">
              <FiBook className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucun cours inscrit
              </h3>
              <p className="text-secondary-600 mb-4">
                Explorez nos cours et commencez votre apprentissage dès aujourd'hui.
              </p>
              <Link to="/courses" className="btn-primary">
                Découvrir les cours
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 5).map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white">
                      <FiBook className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {enrollment.course?.title || 'Cours'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>Inscrit le {formatDate(enrollment.enrolledAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${
                      enrollment.status === 'COMPLETED' ? 'badge-success' :
                      enrollment.status === 'CONFIRMED' ? 'badge-primary' :
                      'badge-warning'
                    }`}>
                      {enrollment.status === 'COMPLETED' ? 'Terminé' :
                       enrollment.status === 'CONFIRMED' ? 'En cours' :
                       'En attente'}
                    </span>
                    <Link
                      to={`/courses/${enrollment.course?.id}`}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      <FiArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
