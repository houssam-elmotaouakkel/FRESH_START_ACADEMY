import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaSpinner,
  FaEye
} from 'react-icons/fa';
import enrollmentService from '../../services/enrollmentService';
import { formatDate, formatPrice } from '../../utils/helpers';
import { ENROLLMENT_STATUS } from '../../utils/constants';

export default function ManageEnrollments() {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [processing, setProcessing] = useState(null);

  const searchRef = { current: search };
  searchRef.current = search;

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(searchRef.current && { search: searchRef.current }),
      };
      const response = await enrollmentService.getAllEnrollments(params);
      setEnrollments(response.data || []);
      setPagination({
        total: response.pagination?.totalItems || 0,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEnrollments();
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    setProcessing(enrollmentId);
    try {
      await enrollmentService.updateStatus(enrollmentId, newStatus);
      toast.success(t('admin.statusUpdated'));
      fetchEnrollments();
    } catch (error) {
      toast.error(error.message || t('admin.updateError'));
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.PENDING}`}>
        {ENROLLMENT_STATUS[status] || status}
      </span>
    );
  };

  const openDetailModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageEnrollments')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.manageEnrollmentsDesc')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.searchByStudentCourse')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('admin.allStatuses')}</option>
            {Object.entries(ENROLLMENT_STATUS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('admin.noEnrollmentsFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.student')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.course')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {enrollment.user?.firstName?.[0]}{enrollment.user?.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {enrollment.user?.firstName} {enrollment.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {enrollment.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {enrollment.course?.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(enrollment.course?.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(enrollment.enrolledAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailModal(enrollment)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title={t('admin.viewDetails')}
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        
                        {enrollment.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(enrollment.id, 'CONFIRMED')}
                              disabled={processing === enrollment.id}
                              className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50"
                              title={t('admin.validate')}
                            >
                              {processing === enrollment.id ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatusChange(enrollment.id, 'CANCELLED')}
                              disabled={processing === enrollment.id}
                              className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                              title={t('admin.refuse')}
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {enrollment.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(enrollment.id, 'COMPLETED')}
                            disabled={processing === enrollment.id}
                            className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            title={t('admin.markComplete')}
                          >
                            {processing === enrollment.id ? (
                              <FaSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                              <FaCheck className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.total')}: {pagination.total} {t('admin.enrollments').toLowerCase()}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {t('common.previous')}
              </button>
              <span className="px-3 py-1 dark:text-gray-300">{t('admin.page')} {page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.enrollmentDetails')}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('admin.student')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedEnrollment.user?.firstName} {selectedEnrollment.user?.lastName}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('admin.email')}</span>
                <span className="text-gray-900 dark:text-white">{selectedEnrollment.user?.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('admin.course')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedEnrollment.course?.title}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('admin.price')}</span>
                <span className="font-medium text-primary-600">
                  {formatPrice(selectedEnrollment.course?.price)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('admin.enrollmentDate')}</span>
                <span className="text-gray-900 dark:text-white">{formatDate(selectedEnrollment.enrolledAt)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500 dark:text-gray-400">{t('common.status')}</span>
                {getStatusBadge(selectedEnrollment.status)}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {selectedEnrollment.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedEnrollment.id, 'CONFIRMED');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    {t('admin.validate')}
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedEnrollment.id, 'CANCELLED');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    {t('admin.refuse')}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

