import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaStar,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaSpinner,
  FaQuoteLeft
} from 'react-icons/fa';
import testimonialService from '../../services/testimonialService';
import { formatDate } from '../../utils/helpers';

export default function ManageTestimonials() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(statusFilter && { isApproved: statusFilter === 'approved' })
      };
      const response = await testimonialService.getAllTestimonials(params);
      setTestimonials(response.data || []);
      setPagination({
        total: response.pagination?.totalItems || 0,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTestimonials();
  };

  const handleApprove = async (testimonialId, approve) => {
    setProcessing(testimonialId);
    try {
      await testimonialService.updateTestimonial(testimonialId, { isApproved: approve });
      toast.success(approve ? t('admin.testimonialApproved') : t('admin.testimonialRejected'));
      fetchTestimonials();
    } catch (error) {
      toast.error(error.message || t('admin.updateError'));
    } finally {
      setProcessing(null);
    }
  };

  const openDetailModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    
    setProcessing(selectedTestimonial.id);
    try {
      await testimonialService.deleteTestimonial(selectedTestimonial.id);
      toast.success(t('admin.testimonialDeleted'));
      fetchTestimonials();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.deleteError'));
    } finally {
      setProcessing(null);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const visibleTestimonials = testimonials.filter((testimonial) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      testimonial.author?.toLowerCase().includes(term) ||
      testimonial.role?.toLowerCase().includes(term) ||
      testimonial.content?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageTestimonials')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.manageTestimonialsDesc')}</p>
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
              placeholder={t('admin.searchByNameContent')}
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
            <option value="">{t('admin.allTestimonials')}</option>
            <option value="pending">{t('admin.pending')}</option>
            <option value="approved">{t('admin.approved')}</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {/* Testimonials List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : visibleTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <FaStar className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('admin.noTestimonialsFound')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 ${!testimonial.isApproved ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {(testimonial.author || '')
                            .split(' ')
                            .filter(Boolean)
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role || t('admin.roleNotSpecified')}
                        </p>
                      </div>
                      {!testimonial.isApproved && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          {t('admin.pending')}
                        </span>
                      )}
                      {testimonial.isApproved && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {t('admin.approved')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(testimonial.rating || 5)}
                    </div>

                    <div className="relative pl-6">
                      <FaQuoteLeft className="absolute left-0 top-0 w-4 h-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-700 dark:text-gray-300 italic line-clamp-3">
                        {testimonial.content}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                      {formatDate(testimonial.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openDetailModal(testimonial)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={t('admin.viewDetails')}
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    
                    {!testimonial.isApproved && (
                      <button
                        onClick={() => handleApprove(testimonial.id, true)}
                        disabled={processing === testimonial.id}
                        className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50"
                        title={t('admin.approve')}
                      >
                        {processing === testimonial.id ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaCheck className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    
                    {testimonial.isApproved && (
                      <button
                        onClick={() => handleApprove(testimonial.id, false)}
                        disabled={processing === testimonial.id}
                        className="p-2 text-orange-600 hover:text-orange-700 disabled:opacity-50"
                        title={t('admin.removeApproval')}
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteClick(testimonial)}
                      className="p-2 text-red-600 hover:text-red-700"
                      title={t('common.delete')}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.total')}: {pagination.total} {t('admin.testimonials').toLowerCase()}</p>
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
      {showDetailModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.testimonialDetails')}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary-600">
                    {(selectedTestimonial.author || '').split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTestimonial.author}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{selectedTestimonial.role || t('admin.roleNotSpecified')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.role')}</label>
                <p className="text-gray-900 dark:text-white">{selectedTestimonial.role || t('admin.notSpecified')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.rating')}</label>
                <div className="flex items-center gap-1">
                  {renderStars(selectedTestimonial.rating || 5)}
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    ({selectedTestimonial.rating || 5}/5)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.testimonial')}</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 italic">"{selectedTestimonial.content}"</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{t('admin.submittedOn')} {formatDate(selectedTestimonial.createdAt)}</span>
                <span className={selectedTestimonial.isApproved ? 'text-green-600' : 'text-yellow-600'}>
                  {selectedTestimonial.isApproved ? t('admin.approved') : t('admin.pending')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {!selectedTestimonial.isApproved ? (
                <button
                  onClick={() => {
                    handleApprove(selectedTestimonial.id, true);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaCheck />
                  {t('admin.approve')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleApprove(selectedTestimonial.id, false);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  {t('admin.removeApproval')}
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.deleteTestimonial')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.deleteIrreversible')}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('admin.deleteTestimonialConfirm')}{' '}
              <strong className="dark:text-white">
                {selectedTestimonial.author}
              </strong> ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={processing === selectedTestimonial?.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {processing === selectedTestimonial?.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





