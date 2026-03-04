import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaEnvelope,
  FaTrash,
  FaEye,
  FaTimes,
  FaReply,
  FaSpinner
} from 'react-icons/fa';
import contactService from '../../services/contactService';
import { formatDate } from '../../utils/helpers';

export default function ManageContacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [processing, setProcessing] = useState(false);

  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(searchRef.current && { search: searchRef.current }),
        ...(statusFilter && { status: statusFilter })
      };
      const response = await contactService.getAllContacts(params);
      setContacts(response.data || []);
      setPagination({
        total: response.pagination?.totalItems || 0,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchContacts();
  };

  const openDetailModal = async (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
    
    // Mark as read if not already
    if (contact.status === 'UNREAD') {
      try {
        await contactService.updateStatus(contact.id, 'READ');
        fetchContacts();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    
    setProcessing(true);
    try {
      await contactService.deleteContact(selectedContact.id);
      toast.success(t('admin.messageDeleted'));
      fetchContacts();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || t('admin.deleteError'));
    } finally {
      setProcessing(false);
    }
  };

  const getSubjectLabel = (subject) => {
    const key = `admin.subjects.${subject}`;
    const translated = t(key);
    return translated !== key ? translated : subject;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageContacts')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.manageContactsDesc')}</p>
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
              placeholder={t('admin.searchByNameEmailSubject')}
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
            <option value="">{t('admin.allMessages')}</option>
            <option value="UNREAD">{t('admin.unread')}</option>
            <option value="READ">{t('admin.read')}</option>
            <option value="REPLIED">{t('admin.replied')}</option>
            <option value="ARCHIVED">{t('admin.archived')}</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {/* Contacts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <FaEnvelope className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('admin.noMessagesFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.sender')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.subject')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.message')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.date')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${contact.status === 'UNREAD' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {contact.status === 'UNREAD' && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        )}
                        <div>
                          <div className={`text-sm ${contact.status === 'UNREAD' ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white`}>
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                        {getSubjectLabel(contact.subject)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openDetailModal(contact)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title={t('admin.view')}
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title={t('admin.reply')}
                      >
                        <FaReply className="w-4 h-4 inline" />
                      </a>
                      <button
                        onClick={() => handleDeleteClick(contact)}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.total')}: {pagination.total} {t('admin.contacts').toLowerCase()}</p>
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
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.messageDetails')}</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.name')}</label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.email')}</label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.phone')}</label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.phone || t('admin.notProvided')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('common.date')}</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.subject')}</label>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {getSubjectLabel(selectedContact.subject)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.message')}</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
              >
                <FaReply />
                {t('admin.replyByEmail')}
              </a>
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
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.deleteMessage')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.deleteIrreversible')}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('admin.deleteMessageConfirm')} <strong className="dark:text-white">{selectedContact.name}</strong> ?
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

