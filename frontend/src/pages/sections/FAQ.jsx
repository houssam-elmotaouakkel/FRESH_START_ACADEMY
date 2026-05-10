import { useState } from 'react';

const FAQS = [
  {
    q: 'Quels niveaux de langue proposez-vous ?',
    a: "Nous proposons tous les niveaux, du débutant absolu (A1) jusqu'au niveau avancé (B2). Un test de niveau gratuit est disponible à l'inscription pour vous placer dans le groupe adapté.",
  },
  {
    q: "Quelle est la durée d'un cours ?",
    a: "Chaque séance dure entre 1h30 et 2h selon la formule choisie. Les cours sont organisés 2 à 3 fois par semaine pour une progression régulière et efficace.",
  },
  {
    q: 'Y a-t-il des cours pour les enfants ?',
    a: "Oui ! Nous accueillons les enfants dès l'âge de 6 ans. Le soutien scolaire couvre le primaire, le collège et le lycée, avec des méthodes adaptées à chaque tranche d'âge.",
  },
  {
    q: "Les cours d'allemand préparent-ils au visa ?",
    a: "Absolument. Nos cours d'allemand sont spécialement conçus pour préparer les examens Goethe-Zertifikat (A1 à B2), requis pour la plupart des demandes de visa et de regroupement familial en Allemagne.",
  },
  {
    q: "Comment s'inscrire ?",
    a: "Remplissez le formulaire d'inscription ci-dessous, ou appelez-nous au 07 14 26 04 53. Vous pouvez aussi nous contacter sur WhatsApp. Un conseiller vous répondra dans les 24h.",
  },
  {
    q: 'Le matériel pédagogique est-il inclus ?',
    a: "Oui, le matériel pédagogique (livres, exercices, supports numériques) est inclus dans toutes nos formules. Aucun achat supplémentaire n'est nécessaire.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="center">
          <div className="s-tag reveal" style={{ justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>FAQ</span>
          </div>
          <h2 className="s-title reveal">Questions <em>fréquentes</em></h2>
          <p className="s-sub reveal" style={{ margin: '0 auto 40px' }}>
            Tout ce que vous devez savoir avant de commencer votre formation.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <h4>{f.q}</h4>
                <div className="faq-arr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div className="faq-ans" style={{ maxHeight: open === i ? '300px' : '0' }}>
                <div className="faq-ans-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
