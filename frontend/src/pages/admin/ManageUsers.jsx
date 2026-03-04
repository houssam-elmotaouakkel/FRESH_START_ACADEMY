import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import userService from '../../services/userService';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

export default function ManageUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(searchRef.current && { search: searchRef.current }),
        ...(roleFilter && { role: roleFilter })
      };
      const response = await userService.getAllUsers(params);
      setUsers(response.data || []);
      setPagination({
        total: response.pagination?.totalItems || 0,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateRole = async (newRole) => {
    if (!selectedUser) return;
    
    setProcessing(true);
    try {
      await userService.updateUser(selectedUser.id, { role: newRole });
      toast.success(t('admin.roleUpdated'));
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.updateError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success(t('admin.userDeleted'));
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.deleteError'));
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-red-100 text-red-700',
      TEACHER: 'bg-purple-100 text-purple-700',
      STUDENT: 'bg-blue-100 text-blue-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[role] || styles.STUDENT}`}>
        {ROLES[role] || role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageUsers')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.manageUsersDesc')}</p>
        </div>
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
              placeholder={t('admin.searchByNameEmail')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('admin.allRoles')}</option>
            {Object.entries(ROLES).map(([key, value]) => (
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

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('admin.noUsersFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('auth.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.registeredAt')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.phone || t('admin.noPhone')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title={t('admin.editRole')}
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900"
                        title={t('common.delete')}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.total')}: {pagination.total} {t('admin.users').toLowerCase()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {t('common.previous')}
              </button>
              <span className="px-3 py-1 dark:text-gray-300">
                {t('admin.page')} {page} / {pagination.totalPages}
              </span>
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

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.editRole')}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('admin.user')}: <strong className="dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</strong>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleUpdateRole('STUDENT')}
                disabled={processing || selectedUser.role === 'STUDENT'}
                className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                  selectedUser.role === 'STUDENT'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <FaUser className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{t('admin.user')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.standardAccess')}</p>
                </div>
              </button>

              <button
                onClick={() => handleUpdateRole('TEACHER')}
                disabled={processing || selectedUser.role === 'TEACHER'}
                className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                  selectedUser.role === 'TEACHER'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <FaUser className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{t('admin.roles.TEACHER')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.teacherAccess')}</p>
                </div>
              </button>

              <button
                onClick={() => handleUpdateRole('ADMIN')}
                disabled={processing || selectedUser.role === 'ADMIN'}
                className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                  selectedUser.role === 'ADMIN'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <FaUserShield className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{t('admin.roles.ADMIN')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.adminAccess')}</p>
                </div>
              </button>
            </div>

            {processing && (
              <div className="flex items-center justify-center mt-4 text-primary-600">
                <FaSpinner className="animate-spin mr-2" />
                {t('admin.updating')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.deleteUser')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.deleteIrreversible')}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('admin.deleteUserConfirm')}{' '}
              <strong className="dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</strong> ?
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

