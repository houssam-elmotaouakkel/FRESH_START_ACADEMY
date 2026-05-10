import { useState } from 'react';
import contactService from '../../services/contactService';

const POINTS = [
  'Réponse garantie en moins de 24h',
  'Test de niveau gratuit inclus',
  'Cours essai sans engagement',
  'Paiement mensuel flexible',
];

const INITIAL = { firstName: '', lastName: '', phone: '', course: '', level: '', message: '' };

function Register() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.phone || !form.course) {
      setError('Veuillez remplir au moins le prénom, le téléphone et le cours souhaité.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await contactService.sendMessage({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: 'inscription@freshstartacademy.ma',
        phone: form.phone,
        subject: `Inscription - ${form.course}${form.level ? ` (${form.level})` : ''}`,
        message: form.message || `Demande d'inscription : ${form.course}. Niveau : ${form.level || 'non précisé'}.`,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
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
            <span>Inscription</span>
          </div>
          <h2>Commencez votre <em>Fresh Start</em> aujourd'hui</h2>
          <p>
            Remplissez le formulaire et notre équipe vous contactera dans les 24 heures pour confirmer
            votre inscription et répondre à vos questions.
          </p>
          <div className="info-pts">
            {POINTS.map((p, i) => (
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
                <div className="ok-icon">🎉</div>
                <h3>Demande envoyée !</h3>
                <p>Merci ! Notre équipe vous contactera dans les 24 heures. À très bientôt chez Fresh Start Academy !</p>
              </div>
            </div>
          ) : (
            <div className="reg-form">
              <div className="form-row">
                <div className="form-g">
                  <label>Prénom</label>
                  <input type="text" placeholder="Votre prénom" value={form.firstName} onChange={set('firstName')} />
                </div>
                <div className="form-g">
                  <label>Nom</label>
                  <input type="text" placeholder="Votre nom" value={form.lastName} onChange={set('lastName')} />
                </div>
              </div>
              <div className="form-g">
                <label>Téléphone</label>
                <input type="tel" placeholder="06 XX XX XX XX" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-g">
                <label>Cours souhaité</label>
                <select value={form.course} onChange={set('course')}>
                  <option value="">-- Choisir un cours --</option>
                  <option>Allemand (A1–B2)</option>
                  <option>Anglais</option>
                  <option>Français</option>
                  <option>Soutien scolaire</option>
                  <option>Cours particulier</option>
                </select>
              </div>
              <div className="form-g">
                <label>Niveau actuel</label>
                <select value={form.level} onChange={set('level')}>
                  <option value="">-- Votre niveau --</option>
                  <option>Débutant (A1)</option>
                  <option>Élémentaire (A2)</option>
                  <option>Intermédiaire (B1)</option>
                  <option>Supérieur (B2)</option>
                  <option>Scolaire (primaire/collège/lycée)</option>
                </select>
              </div>
              <div className="form-g">
                <label>Message (optionnel)</label>
                <textarea
                  placeholder="Vos questions ou précisions..."
                  value={form.message}
                  onChange={set('message')}
                />
              </div>
              {error && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
              )}
              <button className="btn-sub" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading' ? 'Envoi en cours...' : "Envoyer ma demande d'inscription →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Register;
