import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaEnvelope,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheck,
  FaReply,
  FaSpinner
} from 'react-icons/fa';
import contactService from '../../services/contactService';
import { formatDate } from '../../utils/helpers';

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [page, readFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(readFilter && { isRead: readFilter === 'read' })
      };
      const response = await contactService.getContacts(params);
      setContacts(response.data.contacts || []);
      setPagination(response.data.pagination || { total: 0, totalPages: 1 });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchContacts();
  };

  const openDetailModal = async (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
    
    // Mark as read if not already
    if (!contact.isRead) {
      try {
        await contactService.markAsRead(contact.id);
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
      toast.success('Message supprimé avec succès');
      fetchContacts();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setProcessing(false);
    }
  };

  const getSubjectLabel = (subject) => {
    const subjects = {
      information: 'Demande d\'information',
      inscription: 'Inscription',
      support: 'Support technique',
      partenariat: 'Partenariat',
      autre: 'Autre'
    };
    return subjects[subject] || subject;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages de contact</h1>
        <p className="text-gray-600">Consultez et gérez les messages reçus via le formulaire de contact</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou sujet..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={readFilter}
            onChange={(e) => {
              setReadFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les messages</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <FaEnvelope className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Aucun message trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`hover:bg-gray-50 ${!contact.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {!contact.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        )}
                        <div>
                          <div className={`text-sm ${!contact.isRead ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                        {getSubjectLabel(contact.subject)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openDetailModal(contact)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title="Voir"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Répondre"
                      >
                        <FaReply className="w-4 h-4 inline" />
                      </a>
                      <button
                        onClick={() => handleDeleteClick(contact)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Total: {pagination.total} messages</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-3 py-1">Page {page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails du message</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                  <p className="text-gray-900">{selectedContact.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Sujet</label>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {getSubjectLabel(selectedContact.subject)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
              >
                <FaReply />
                Répondre par email
              </a>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Supprimer le message</h3>
                <p className="text-gray-500 text-sm">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le message de <strong>{selectedContact.name}</strong> ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
