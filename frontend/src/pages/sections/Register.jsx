import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle } from 'react-icons/fi';
import contactService from '../../services/contactService';

const INITIAL = { firstName: '', lastName: '', email: '', phone: '', course: '', level: '', message: '' };

function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const points = t('landing.register.points', { returnObjects: true });
  const courseOptions = t('landing.register.courseOptions', { returnObjects: true });
  const levelOptions = t('landing.register.levelOptions', { returnObjects: true });

  const handleSubmit = async () => {
    if (!form.firstName || !form.phone || !form.course) {
      setError(t('landing.register.errorRequired'));
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await contactService.sendMessage({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim() || 'inscription@freshstartacademy.ma',
        phone: form.phone,
        subject: `${t('landing.register.subjectPrefix')}${form.course}${form.level ? ` (${form.level})` : ''}`,
        message:
          form.message ||
          t('landing.register.messageFallback', {
            course: form.course,
            level: form.level || t('landing.register.levelUnset'),
          }),
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || t('landing.register.errorGeneric'));
    }
  };

  return (
    <section id="register">
      <div className="reg-grid">
        <div className="reg-info reveal-l">
          <div className="s-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>{t('landing.register.tag')}</span>
          </div>
          <h2>
            {t('landing.register.titlePre')}<em>{t('landing.register.titleEm')}</em>{t('landing.register.titlePost')}
          </h2>
          <p>{t('landing.register.body')}</p>
          <div className="info-pts">
            {points.map((p, i) => (
              <div key={i} className="info-pt">
                <div className="i-dot" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-r">
          {status === 'success' ? (
            <div className="reg-form">
              <div className="form-ok" style={{ display: 'block' }}>
                <div className="ok-icon"><FiCheckCircle style={{ color: '#16a34a' }} /></div>
                <h3>{t('landing.register.successTitle')}</h3>
                <p>{t('landing.register.successBody')}</p>
              </div>
            </div>
          ) : (
            <div className="reg-form">
              <div className="form-row">
                <div className="form-g">
                  <label>{t('landing.register.firstName')}</label>
                  <input type="text" placeholder={t('landing.register.firstNamePlaceholder')} value={form.firstName} onChange={set('firstName')} />
                </div>
                <div className="form-g">
                  <label>{t('landing.register.lastName')}</label>
                  <input type="text" placeholder={t('landing.register.lastNamePlaceholder')} value={form.lastName} onChange={set('lastName')} />
                </div>
              </div>
              <div className="form-g">
                <label>{t('landing.register.phone')}</label>
                <input type="tel" placeholder={t('landing.register.phonePlaceholder')} value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-g">
                <label>{t('landing.register.email')}</label>
                <input type="email" placeholder={t('landing.register.emailPlaceholder')} value={form.email} onChange={set('email')} />
              </div>
              <div className="form-g">
                <label>{t('landing.register.course')}</label>
                <select value={form.course} onChange={set('course')}>
                  <option value="">{t('landing.register.coursePlaceholder')}</option>
                  {courseOptions.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="form-g">
                <label>{t('landing.register.level')}</label>
                <select value={form.level} onChange={set('level')}>
                  <option value="">{t('landing.register.levelPlaceholder')}</option>
                  {levelOptions.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="form-g">
                <label>{t('landing.register.message')}</label>
                <textarea
                  placeholder={t('landing.register.messagePlaceholder')}
                  value={form.message}
                  onChange={set('message')}
                />
              </div>
              {error && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
              )}
              <button className="btn-sub" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading' ? t('landing.register.submitting') : t('landing.register.submit')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Register;
