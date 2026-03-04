import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaGraduationCap,
  FaTimes,
  FaSpinner,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import courseService from '../../services/courseService';
import { formatPrice } from '../../utils/helpers';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../../utils/constants';

export default function ManageCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const searchRef = useRef(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(searchRef.current && { search: searchRef.current }),
        ...(categoryFilter && { category: categoryFilter })
      };
      const response = await courseService.getAllCourses(params);
      setCourses(response.data || []);
      setPagination({
        total: response.pagination?.totalItems || 0,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedCourse(null);
    reset({
      title: '',
      description: '',
      category: '',
      level: 'BEGINNER',
      price: '',
      duration: '',
      maxStudents: 20,
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    reset({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration || '',
      maxStudents: course.maxStudents || 20,
      isActive: course.isActive
    });
    setShowModal(true);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const courseData = {
        ...data,
        price: parseFloat(data.price),
        duration: data.duration ? parseInt(data.duration) : null,
        maxStudents: parseInt(data.maxStudents)
      };

      if (isEditing && selectedCourse) {
        await courseService.updateCourse(selectedCourse.id, courseData);
        toast.success(t('admin.courseUpdated'));
      } else {
        await courseService.createCourse(courseData);
        toast.success(t('admin.courseCreated'));
      }
      
      fetchCourses();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.saveError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    
    setProcessing(true);
    try {
      await courseService.deleteCourse(selectedCourse.id);
      toast.success(t('admin.courseDeleted'));
      fetchCourses();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.deleteError'));
    } finally {
      setProcessing(false);
    }
  };

  const toggleCourseStatus = async (course) => {
    try {
      await courseService.updateCourse(course.id, { isActive: !course.isActive });
      toast.success(`${t('admin.course')} ${course.isActive ? t('admin.courseDeactivated').toLowerCase() : t('admin.courseActivated').toLowerCase()}`);
      fetchCourses();
    } catch (error) {
      toast.error(error.message || t('admin.updateError'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageCourses')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.manageCoursesDesc')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          {t('admin.newCourse')}
        </button>
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
              placeholder={t('admin.searchCourse')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('admin.allCategories')}</option>
            {Object.entries(COURSE_CATEGORIES).map(([key, value]) => (
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

      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('admin.noCoursesFound')}</p>
            <button
              onClick={openCreateModal}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('admin.createFirstCourse')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.course')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.level')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.price')}
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
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FaGraduationCap className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {course.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                        {COURSE_CATEGORIES[course.category] || course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {COURSE_LEVELS[course.level] || course.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCourseStatus(course)}
                        className="flex items-center gap-2"
                      >
                        {course.isActive ? (
                          <>
                            <FaToggleOn className="w-6 h-6 text-green-500" />
                            <span className="text-sm text-green-600">{t('admin.active')}</span>
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('admin.inactive')}</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(course)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.total')}: {pagination.total} {t('admin.courses').toLowerCase()}</p>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isEditing ? t('admin.editCourse') : t('admin.newCourse')}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.title')} *</label>
                <input
                  {...register('title', { required: t('admin.titleRequired') })}
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.description')} *</label>
                <textarea
                  {...register('description', { required: t('admin.descriptionRequired') })}
                  rows={3}
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.category')} *</label>
                  <select
                    {...register('category', { required: t('admin.categoryRequired') })}
                    className={`w-full px-4 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">{t('admin.selectOption')}</option>
                    {Object.entries(COURSE_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.level')} *</label>
                  <select
                    {...register('level', { required: t('admin.levelRequired') })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(COURSE_LEVELS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.priceLabel')} *</label>
                  <input
                    {...register('price', { required: t('admin.priceRequired'), min: { value: 0, message: t('admin.invalidPrice') } })}
                    type="number"
                    step="0.01"
                    className={`w-full px-4 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.duration')}</label>
                  <input
                    {...register('duration')}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.maxSeats')}</label>
                  <input
                    {...register('maxStudents')}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">{t('admin.courseActive')}</label>
              </div>

              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <FaSpinner className="animate-spin" /> : null}
                  {isEditing ? t('admin.update') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.deleteCourse')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.deleteIrreversible')}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('admin.deleteCourseConfirm')} <strong className="dark:text-white">{selectedCourse.title}</strong> ?
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
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                {t('common.delete')}


