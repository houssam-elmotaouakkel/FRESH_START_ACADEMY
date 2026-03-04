import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts (not lazy — they wrap everything)
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Auth guards (tiny, always needed)
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy-loaded Pages — code splitting per route
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const MyEnrollments = lazy(() => import('./pages/MyEnrollments'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages — separate chunk
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses'));
const ManageEnrollments = lazy(() => import('./pages/admin/ManageEnrollments'));
const ManageContacts = lazy(() => import('./pages/admin/ManageContacts'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));

// Suspense fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="spinner" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Pages Publiques
      { index: true, element: withSuspense(Home) },
      { path: 'about', element: withSuspense(About) },
      { path: 'courses', element: withSuspense(Courses) },
      { path: 'courses/:id', element: withSuspense(CourseDetail) },
      { path: 'contact', element: withSuspense(Contact) },
      { path: 'login', element: withSuspense(Login) },
      { path: 'register', element: withSuspense(Register) },
      { path: 'forgot-password', element: withSuspense(ForgotPassword) },
      { path: 'terms', element: withSuspense(Terms) },

      // Pages User (protégées)
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            {withSuspense(Dashboard)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            {withSuspense(Profile)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-enrollments',
        element: (
          <ProtectedRoute>
            {withSuspense(MyEnrollments)}
          </ProtectedRoute>
        ),
      },

      // 404
      { path: '*', element: withSuspense(NotFound) },
    ],
  },

  // Routes Admin (layout différent)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: 'users', element: withSuspense(ManageUsers) },
      { path: 'courses', element: withSuspense(ManageCourses) },
      { path: 'enrollments', element: withSuspense(ManageEnrollments) },
      { path: 'contacts', element: withSuspense(ManageContacts) },
      { path: 'testimonials', element: withSuspense(ManageTestimonials) },
    ],
  },
]);

export default router;