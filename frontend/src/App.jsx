import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './router';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import { initAnalytics, shutdownAnalytics } from './lib/analytics';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    fetchUser();
    initTheme();
    initAnalytics();

    return () => shutdownAnalytics();
  }, [fetchUser, initTheme]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}

export default App;
