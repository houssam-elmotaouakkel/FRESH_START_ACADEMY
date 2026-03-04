import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiClock, FiSend, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import contactService from '../services/contactService';
import LocationMap from '../components/branding/LocationMap';

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        subject: data.subject,
        message: data.message,
      };

      await contactService.sendMessage(payload);
      toast.success(t('contact.success'));
      reset();
    } catch (error) {
      toast.error(error.message || t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const infos = [
    { icon: <FiMapPin />, title: t('footer.address'), value: import.meta.env.VITE_CENTER_ADDRESS || 'Rabat, Maroc' },
    { icon: <FiPhone />, title: t('contact.phone'), value: '+212 5 22 00 00 00' },
    { icon: <FiMail />, title: t('contact.email'), value: 'contact@freshstart.ma' },
    { icon: <FiClock />, title: t('common.date'), value: 'Lundi - Samedi, 9h00 - 19h00' },
  ];

  return (
    <div className="min-h-screen">
      <section className="gradient-primary text-white">
        <div className="content-wrap px-4 py-14">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary-100/85 mb-2">{t('common.contact')}</p>
          <h1 className="section-title text-white mb-4">{t('contact.title')}</h1>
          <p className="text-white/85 max-w-2xl">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="content-wrap px-4 py-12 grid lg:grid-cols-2 gap-8">
        <div className="card p-7">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">{t('contact.send')}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-secondary-800 font-medium mb-1.5">{t('auth.firstName')} *</label>
                <input
                  type="text"
                  placeholder={t('auth.firstName')}
                  {...register('firstName', { required: t('errors.required') })}
                  className={errors.firstName ? 'border-error-500' : ''}
                />
                {errors.firstName && <p className="text-error-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-secondary-800 font-medium mb-1.5">{t('auth.lastName')} *</label>
                <input
                  type="text"
                  placeholder={t('auth.lastName')}
                  {...register('lastName', { required: t('errors.required') })}
                  className={errors.lastName ? 'border-error-500' : ''}
                />
                {errors.lastName && <p className="text-error-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-secondary-800 font-medium mb-1.5">{t('contact.email')} *</label>
              <input
                type="email"
                placeholder={t('contact.email')}
                {...register('email', {
                  required: t('errors.required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('errors.invalidEmail'),
                  },
                })}
                className={errors.email ? 'border-error-500' : ''}
              />
              {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-secondary-800 font-medium mb-1.5">{t('contact.subject')} *</label>
              <select
                {...register('subject', { required: t('errors.required') })}
                className={errors.subject ? 'border-error-500' : ''}
              >
                <option value="">Choisissez un sujet</option>
                <option value="information">Demande information</option>
                <option value="inscription">Inscription</option>
                <option value="cours">Question sur les cours</option>
                <option value="autre">Autre</option>
              </select>
              {errors.subject && <p className="text-error-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-secondary-800 font-medium mb-1.5">{t('contact.message')} *</label>
              <textarea
                rows={5}
                placeholder={t('contact.message')}
                {...register('message', {
                  required: t('errors.required'),
                  minLength: { value: 10, message: 'Minimum 10 caracteres' },
                })}
                className={errors.message ? 'border-error-500' : ''}
              />
              {errors.message && <p className="text-error-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? t('common.loading') : (
                <>
                  <FiSend />
                  {t('contact.send')}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Informations utiles</h2>
            <div className="space-y-3">
              {infos.map((info) => (
                <div key={info.title} className="flex items-start gap-3 p-3 rounded-xl bg-secondary-50 border border-secondary-200/70">
                  <div className="w-9 h-9 rounded-full gradient-primary text-white flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900">{info.title}</p>
                    <p className="text-secondary-700 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LocationMap />
        </div>
      </section>
    </div>
  );
}

export default Contact;
