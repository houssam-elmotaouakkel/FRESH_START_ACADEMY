import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBook, FiCalendar, FiClock, FiArrowRight, FiSearch } from 'react-icons/fi'
import enrollmentService from '../services/enrollmentService'
import { formatDate } from '../utils/helpers'

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentService.getMyEnrollments()
      setEnrollments(response.data.enrollments || [])
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesFilter = filter === 'all' || enrollment.status === filter
    const matchesSearch = enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusLabels = {
    PENDING: 'En attente',
    ACTIVE: 'En cours',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé'
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="gradient-primary rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Mes inscriptions</h1>
          <p className="text-white/90">
            Gérez vos inscriptions et suivez votre progression.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'ACTIVE', 'COMPLETED', 'PENDING'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="card p-12 text-center">
            <FiBook className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filter !== 'all'
                ? 'Aucun résultat trouvé'
                : 'Aucune inscription'}
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || filter !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Explorez nos cours et inscrivez-vous pour commencer à apprendre.'}
            </p>
            <Link to="/courses" className="btn-primary">
              Découvrir les cours
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="card p-6 hover:shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <FiBook className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {enrollment.course?.title || 'Cours'}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          Inscrit le {formatDate(enrollment.createdAt)}
                        </span>
                        {enrollment.course?.duration && (
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {enrollment.course.duration}h de cours
                          </span>
                        )}
                      </div>
                      {enrollment.course?.level && (
                        <span className="inline-block mt-2 badge badge-primary">
                          {enrollment.course.level}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`badge ${
                      enrollment.status === 'COMPLETED' ? 'badge-success' :
                      enrollment.status === 'ACTIVE' ? 'badge-primary' :
                      enrollment.status === 'CANCELLED' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {statusLabels[enrollment.status]}
                    </span>
                    <Link
                      to={`/courses/${enrollment.courseId}`}
                      className="btn-primary py-2 px-4 flex items-center gap-2"
                    >
                      Voir le cours
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyEnrollments