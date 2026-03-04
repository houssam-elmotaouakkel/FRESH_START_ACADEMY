import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import userService from '../services/userService'
import authService from '../services/authService'

function Profile() {
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors }
  } = useForm()

  const newPassword = watch('newPassword')

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await userService.updateProfile(data)
      setUser(response.data)
      toast.success('Profil mis à jour avec succès')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.changePassword(
        data.currentPassword,
        data.newPassword
      )
      toast.success('Mot de passe modifié avec succès')
      setIsChangingPassword(false)
      resetPassword()
    } catch (error) {
      toast.error(error.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="gradient-primary rounded-2xl p-8 mb-8 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-white/80">{user?.email}</p>
          <span className="inline-block mt-2 px-4 py-1 bg-white/20 rounded-full text-sm">
            {user?.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}
          </span>
        </div>

        {/* Profile Form */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Informations personnelles</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-sm py-2 px-4"
              >
                Modifier
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiUser className="inline mr-2" />
                  Prénom
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'Le prénom est requis' })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-secondary-100' : ''} ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiUser className="inline mr-2" />
                  Nom
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Le nom est requis' })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-secondary-100' : ''} ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiMail className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-secondary-100' : ''} ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FiPhone className="inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-secondary-100' : ''}`}
                  placeholder="+212 6 00 00 00 00"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiSave />
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    reset()
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Password Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              <FiLock className="inline mr-2" />
              Sécurité
            </h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-secondary text-sm py-2 px-4"
              >
                Changer le mot de passe
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', {
                    required: 'Le mot de passe actuel est requis'
                  })}
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'Le nouveau mot de passe est requis',
                    minLength: {
                      value: 8,
                      message: 'Minimum 8 caractères'
                    }
                  })}
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: value =>
                      value === newPassword || 'Les mots de passe ne correspondent pas'
                  })}
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    resetPassword()
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {!isChangingPassword && (
            <p className="text-secondary-600">
              Nous vous recommandons d'utiliser un mot de passe fort avec au moins 8 caractères,
              incluant des lettres majuscules, minuscules et des chiffres.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

