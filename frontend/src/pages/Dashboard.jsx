import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBook, FiClock, FiAward, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import enrollmentService from '../services/enrollmentService'
import { formatDate } from '../utils/helpers'
import PageTransition from '../components/common/PageTransition'

const STATUS_COLORS = {
  PENDING: '#d97706',
  CONFIRMED: '#2467cd',
  COMPLETED: '#16a34a',
  CANCELLED: '#dc2626',
}

const STATUS_LABELS = {
  PENDING: 'En attente',
  CONFIRMED: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
}

function Dashboard() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
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
        inProgress: data.filter((e) => e.status === 'CONFIRMED').length,
        completed: data.filter((e) => e.status === 'COMPLETED').length,
      })
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Chart data ---
  const statusDistribution = Object.entries(
    enrollments.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1
      return acc
    }, {})
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#94a3b8',
  }))

  // Monthly enrollment trend (last 6 months)
  const monthlyTrend = (() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const label = d.toLocaleString('fr', { month: 'short' })
      const count = enrollments.filter((e) => {
        const ed = new Date(e.enrolledAt)
        return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth()
      }).length
      months.push({ name: label, inscriptions: count })
    }
    return months
  })()

  const completionRate =
    stats.totalCourses > 0 ? Math.round((stats.completed / stats.totalCourses) * 100) : 0

  const statCards = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Cours inscrits',
      value: stats.totalCourses,
      color: 'bg-primary-500',
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      label: 'En cours',
      value: stats.inProgress,
      color: 'bg-warning-500',
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      label: 'Complétés',
      value: stats.completed,
      color: 'bg-success-500',
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-primary rounded-2xl p-8 mb-8 text-white"
          >
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user?.firstName} !
            </h1>
            <p className="text-white/90">
              Bienvenue sur votre tableau de bord. Suivez votre progression et continuez à apprendre.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 dark:text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-full text-white`}>{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          {!loading && enrollments.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart — Status Distribution */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Répartition par statut
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {statusDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Bar Chart — Monthly Trend */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Inscriptions par mois
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyTrend}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="inscriptions" fill="#2467cd" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* Progress bar */}
          {!loading && stats.totalCourses > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Taux de complétion
                </h3>
                <span className="text-2xl font-bold text-primary-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-primary-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}

          {/* Recent Enrollments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mes cours récents</h2>
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
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Aucun cours inscrit
                </h3>
                <p className="text-secondary-600 dark:text-gray-400 mb-4">
                  Explorez nos cours et commencez votre apprentissage dès aujourd&apos;hui.
                </p>
                <Link to="/courses" className="btn-primary">
                  Découvrir les cours
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-gray-800 rounded-xl hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white">
                        <FiBook className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {enrollment.course?.title || 'Cours'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span>Inscrit le {formatDate(enrollment.enrolledAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`badge ${
                          enrollment.status === 'COMPLETED'
                            ? 'badge-success'
                            : enrollment.status === 'CONFIRMED'
                            ? 'badge-primary'
                            : 'badge-warning'
                        }`}
                      >
                        {STATUS_LABELS[enrollment.status] || enrollment.status}
                      </span>
                      <Link
                        to={`/courses/${enrollment.course?.id}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        <FiArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard
