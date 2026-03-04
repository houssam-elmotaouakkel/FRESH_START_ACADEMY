import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success(t('auth.loginSuccess'));
      return;
    }
    toast.error(result.error || t('errors.serverError'));
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[28px] overflow-hidden shadow-[0_20px_52px_rgba(0,9,38,0.2)] border border-primary-700/15 bg-white dark:bg-gray-900">
        <aside className="hidden lg:flex flex-col justify-between gradient-primary text-white p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary-100/80 mb-3">Fresh Start Academy</p>
            <h1 className="text-4xl font-bold leading-tight mb-4">Reprenez votre apprentissage avec un cadre solide</h1>
            <p className="text-white/85">
              Connectez-vous pour suivre vos inscriptions, vos sessions et vos progres.
            </p>
          </div>
          <p className="text-sm text-white/70">Centre de langues a Rabat</p>
        </aside>

        <main className="p-7 sm:p-10">
          <div className="mb-7">
            <Link to="/" className="text-primary-700 dark:text-primary-300 font-semibold text-sm">{t('common.returnToSite')}</Link>
            <h2 className="text-3xl font-bold text-primary-900 dark:text-white mt-3">{t('auth.loginTitle')}</h2>
            <p className="text-secondary-700 dark:text-secondary-300 mt-1">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-primary-700 dark:text-primary-300 font-semibold hover:text-primary-800">
                {t('common.register')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-error-500/30 bg-error-500/10 text-error-600">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-800 dark:text-secondary-100 mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600 dark:text-secondary-300">
                  <FaEnvelope />
                </span>
                <input
                  {...register('email', {
                    required: t('errors.required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('errors.invalidEmail'),
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className={`pl-10 ${errors.email ? 'border-error-500' : ''}`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-800 dark:text-secondary-100 mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600 dark:text-secondary-300">
                  <FaLock />
                </span>
                <input
                  {...register('password', {
                    required: t('errors.required'),
                    minLength: {
                      value: 6,
                      message: t('errors.passwordMin'),
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`pl-10 pr-10 ${errors.password ? 'border-error-500' : ''}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600 dark:text-secondary-300"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.loginTitle')
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
