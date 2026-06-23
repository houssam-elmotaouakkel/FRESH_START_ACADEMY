import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './router';
import { useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { initAnalytics, shutdownAnalytics } from './lib/tracker';

function App() {
  useEffect(() => {
    try { initAnalytics(); } catch { /* analytics blocked */ }

    return () => { try { shutdownAnalytics(); } catch { /* noop */ } };
  }, []);

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
