import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaGraduationCap,
  FaClipboardList,
  FaEnvelope,
  FaStar,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import userService from '../../services/userService';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import contactService from '../../services/contactService';
import testimonialService from '../../services/testimonialService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    contacts: 0,
    testimonials: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        usersRes,
        coursesRes,
        enrollmentsRes,
        contactsRes,
        testimonialsRes
      ] = await Promise.all([
        userService.getUsers({ limit: 1 }),
        courseService.getCourses({ limit: 1 }),
        enrollmentService.getAllEnrollments({ limit: 5 }),
        contactService.getContacts({ limit: 5 }),
        testimonialService.getAllTestimonials({ limit: 1 })
      ]);

      setStats({
        users: usersRes.data.pagination?.total || 0,
        courses: coursesRes.data.pagination?.total || 0,
        enrollments: enrollmentsRes.data.pagination?.total || 0,
        contacts: contactsRes.data.pagination?.total || 0,
        testimonials: testimonialsRes.data.pagination?.total || 0
      });

      setRecentEnrollments(enrollmentsRes.data.enrollments || []);
      setRecentContacts(contactsRes.data.contacts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FaUsers,
      label: 'Utilisateurs',
      value: stats.users,
      color: 'bg-blue-500',
      link: '/admin/users',
      trend: '+12%'
    },
    {
      icon: FaGraduationCap,
      label: 'Cours',
      value: stats.courses,
      color: 'bg-green-500',
      link: '/admin/courses',
      trend: '+5%'
    },
    {
      icon: FaClipboardList,
      label: 'Inscriptions',
      value: stats.enrollments,
      color: 'bg-purple-500',
      link: '/admin/enrollments',
      trend: '+18%'
    },
    {
      icon: FaEnvelope,
      label: 'Messages',
      value: stats.contacts,
      color: 'bg-orange-500',
      link: '/admin/contacts',
      trend: '+8%'
    },
    {
      icon: FaStar,
      label: 'Témoignages',
      value: stats.testimonials,
      color: 'bg-yellow-500',
      link: '/admin/testimonials',
      trend: '+3%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de Fresh Start Academy</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <FaArrowUp className="w-3 h-3 mr-1" />
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Inscriptions récentes</h2>
              <Link
                to="/admin/enrollments"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentEnrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune inscription récente</p>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {enrollment.course?.title}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : enrollment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Messages récents</h2>
              <Link
                to="/admin/contacts"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentContacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun message récent</p>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                    </div>
                    {!contact.isRead && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/courses"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
          >
            <FaGraduationCap className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
              Ajouter un cours
            </span>
          </Link>
          <Link
            to="/admin/users"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
          >
            <FaUsers className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
              Gérer les utilisateurs
            </span>
          </Link>
          <Link
            to="/admin/testimonials"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
          >
            <FaStar className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
              Valider témoignages
            </span>
          </Link>
          <Link
            to="/admin/contacts"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
          >
            <FaEnvelope className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
              Voir les messages
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
