import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaGraduationCap,
  FaClipboardList,
  FaEnvelope,
  FaStar,
  FaArrowUp,
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
    testimonials: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes, enrollmentsRes, contactsRes, testimonialsRes] = await Promise.all([
        userService.getAllUsers({ limit: 1 }),
        courseService.getAllCourses({ limit: 1 }),
        enrollmentService.getAllEnrollments({ limit: 5 }),
        contactService.getAllContacts({ limit: 5 }),
        testimonialService.getAllTestimonials({ limit: 1 }),
      ]);

      setStats({
        users: usersRes.pagination?.totalItems || 0,
        courses: coursesRes.pagination?.totalItems || 0,
        enrollments: enrollmentsRes.pagination?.totalItems || 0,
        contacts: contactsRes.pagination?.totalItems || 0,
        testimonials: testimonialsRes.pagination?.totalItems || 0,
      });

      setRecentEnrollments(enrollmentsRes.data || []);
      setRecentContacts(contactsRes.data || []);
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
      link: '/admin/users',
      trend: '+12%',
    },
    {
      icon: FaGraduationCap,
      label: 'Cours',
      value: stats.courses,
      link: '/admin/courses',
      trend: '+5%',
    },
    {
      icon: FaClipboardList,
      label: 'Inscriptions',
      value: stats.enrollments,
      link: '/admin/enrollments',
      trend: '+18%',
    },
    {
      icon: FaEnvelope,
      label: 'Messages',
      value: stats.contacts,
      link: '/admin/contacts',
      trend: '+8%',
    },
    {
      icon: FaStar,
      label: 'Temoignages',
      value: stats.testimonials,
      link: '/admin/testimonials',
      trend: '+3%',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-primary-700 mb-2">Administration</p>
        <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
        <p className="text-secondary-700">Vue globale de Fresh Start Academy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className="card p-5 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl gradient-primary text-white flex items-center justify-center">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-600">
                <FaArrowUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-primary-900">{stat.value}</p>
            <p className="text-sm text-secondary-700">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-5 border-b border-secondary-200/70 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-900">Inscriptions recentes</h2>
            <Link to="/admin/enrollments" className="text-sm font-medium text-primary-700 hover:text-primary-800">
              Voir tout
            </Link>
          </div>
          <div className="p-5">
            {recentEnrollments.length === 0 ? (
              <p className="text-secondary-700 text-center py-6">Aucune inscription recente</p>
            ) : (
              <div className="space-y-3">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-3 rounded-xl bg-secondary-50 border border-secondary-200/70 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-primary-900">
                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                      </p>
                      <p className="text-sm text-secondary-700">{enrollment.course?.title}</p>
                    </div>
                    <span
                      className={`badge ${
                        enrollment.status === 'CONFIRMED'
                          ? 'badge-success'
                          : enrollment.status === 'PENDING'
                          ? 'badge-warning'
                          : 'badge-primary'
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

        <div className="card">
          <div className="p-5 border-b border-secondary-200/70 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-900">Messages recents</h2>
            <Link to="/admin/contacts" className="text-sm font-medium text-primary-700 hover:text-primary-800">
              Voir tout
            </Link>
          </div>
          <div className="p-5">
            {recentContacts.length === 0 ? (
              <p className="text-secondary-700 text-center py-6">Aucun message recent</p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="p-3 rounded-xl bg-secondary-50 border border-secondary-200/70 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-primary-900">{contact.name}</p>
                      <p className="text-sm text-secondary-700 truncate">{contact.subject}</p>
                      <p className="text-xs text-secondary-600">{contact.email}</p>
                    </div>
                    {contact.status === 'UNREAD' && (
                      <span className="w-2.5 h-2.5 bg-primary-700 rounded-full mt-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin/courses" className="p-4 rounded-xl bg-secondary-50 border border-secondary-200/70 hover:border-primary-300 transition-colors text-center">
            <FaGraduationCap className="w-7 h-7 text-primary-700 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-900">Ajouter cours</span>
          </Link>
          <Link to="/admin/users" className="p-4 rounded-xl bg-secondary-50 border border-secondary-200/70 hover:border-primary-300 transition-colors text-center">
            <FaUsers className="w-7 h-7 text-primary-700 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-900">Utilisateurs</span>
          </Link>
          <Link to="/admin/testimonials" className="p-4 rounded-xl bg-secondary-50 border border-secondary-200/70 hover:border-primary-300 transition-colors text-center">
            <FaStar className="w-7 h-7 text-primary-700 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-900">Temoignages</span>
          </Link>
          <Link to="/admin/contacts" className="p-4 rounded-xl bg-secondary-50 border border-secondary-200/70 hover:border-primary-300 transition-colors text-center">
            <FaEnvelope className="w-7 h-7 text-primary-700 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-900">Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
