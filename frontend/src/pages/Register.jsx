import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaSpinner } from 'react-icons/fa';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };

    const result = await registerUser(userData);
    if (result.success) {
      toast.success('Inscription reussie');
      return;
    }
    toast.error(result.error || 'Erreur lors de l inscription');
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[28px] overflow-hidden shadow-[0_20px_52px_rgba(0,9,38,0.2)] border border-primary-700/15 bg-white">
        <aside className="hidden lg:flex flex-col justify-between gradient-primary text-white p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary-100/80 mb-3">Fresh Start Academy</p>
            <h1 className="text-4xl font-bold leading-tight mb-4">Creez votre compte en moins d une minute</h1>
            <p className="text-white/85">
              Inscrivez-vous pour rejoindre nos parcours en francais, anglais et arabe.
            </p>
          </div>
          <p className="text-sm text-white/70">Parcours progressif et suivi personnalise</p>
        </aside>

        <main className="p-7 sm:p-10">
          <div className="mb-6">
            <Link to="/" className="text-primary-700 font-semibold text-sm">Retour accueil</Link>
            <h2 className="text-3xl font-bold text-primary-900 mt-3">Inscription</h2>
            <p className="text-secondary-700 mt-1">
              Deja inscrit ?{' '}
              <Link to="/login" className="text-primary-700 font-semibold hover:text-primary-800">
                Connectez-vous
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-error-500/30 bg-error-500/10 text-error-600">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1">Prenom</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaUser /></span>
                  <input
                    {...register('firstName', {
                      required: 'Le prenom est requis',
                      minLength: { value: 2, message: 'Minimum 2 caracteres' },
                    })}
                    type="text"
                    className={`pl-10 ${errors.firstName ? 'border-error-500' : ''}`}
                    placeholder="Prenom"
                  />
                </div>
                {errors.firstName && <p className="text-sm text-error-600 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1">Nom</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaUser /></span>
                  <input
                    {...register('lastName', {
                      required: 'Le nom est requis',
                      minLength: { value: 2, message: 'Minimum 2 caracteres' },
                    })}
                    type="text"
                    className={`pl-10 ${errors.lastName ? 'border-error-500' : ''}`}
                    placeholder="Nom"
                  />
                </div>
                {errors.lastName && <p className="text-sm text-error-600 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaEnvelope /></span>
                <input
                  {...register('email', {
                    required: 'L email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide',
                    },
                  })}
                  type="email"
                  className={`pl-10 ${errors.email ? 'border-error-500' : ''}`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {errors.email && <p className="text-sm text-error-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Telephone (optionnel)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaPhone /></span>
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^[0-9+\s-]{10,}$/,
                      message: 'Numero invalide',
                    },
                  })}
                  type="tel"
                  className={`pl-10 ${errors.phone ? 'border-error-500' : ''}`}
                  placeholder="+212 ..."
                />
              </div>
              {errors.phone && <p className="text-sm text-error-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Mot de passe</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaLock /></span>
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: { value: 8, message: 'Minimum 8 caracteres' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Une majuscule, une minuscule et un chiffre requis',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`pl-10 pr-10 ${errors.password ? 'border-error-500' : ''}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-error-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600"><FaLock /></span>
                <input
                  {...register('confirmPassword', {
                    required: 'Confirmation requise',
                    validate: (value) => value === getValues('password') || 'Les mots de passe ne correspondent pas',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-error-500' : ''}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-error-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                {...register('terms', { required: 'Vous devez accepter les conditions' })}
                type="checkbox"
                className="h-4 w-4 mt-1"
              />
              <label className="text-sm text-secondary-700">
                J accepte les{' '}
                <Link to="/terms" className="text-primary-700 font-medium">conditions</Link> et la{' '}
                <Link to="/privacy" className="text-primary-700 font-medium">politique de confidentialite</Link>.
              </label>
            </div>
            {errors.terms && <p className="text-sm text-error-600">{errors.terms.message}</p>}

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                'Creer mon compte'
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
