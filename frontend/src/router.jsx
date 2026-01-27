import { createBrowserRouter } from 'react-router-dom';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Pages Publiques
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages User
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyEnrollments from './pages/MyEnrollments';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageEnrollments from './pages/admin/ManageEnrollments';
import ManageContacts from './pages/admin/ManageContacts';
import ManageTestimonials from './pages/admin/ManageTestimonials';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Pages Publiques
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'courses', element: <Courses /> },
      { path: 'courses/:id', element: <CourseDetail /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Pages User (protégées)
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-enrollments',
        element: (
          <ProtectedRoute>
            <MyEnrollments />
          </ProtectedRoute>
        ),
      },

      // 404
      { path: '*', element: <NotFound /> },
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
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'courses', element: <ManageCourses /> },
      { path: 'enrollments', element: <ManageEnrollments /> },
      { path: 'contacts', element: <ManageContacts /> },
      { path: 'testimonials', element: <ManageTestimonials /> },
    ],
  },
]);

export default router;