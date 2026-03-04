import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Conditions Générales d&apos;Utilisation
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation du site web
            Fresh Start Academy et de ses services en ligne, incluant l&apos;inscription aux cours,
            la gestion de profil et les paiements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Inscription</h2>
          <p>
            L&apos;inscription au site est gratuite et ouverte à toute personne physique majeure.
            L&apos;utilisateur s&apos;engage à fournir des informations exactes et à jour lors de son inscription.
            Chaque utilisateur ne peut disposer que d&apos;un seul compte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Services Proposés</h2>
          <p>
            Fresh Start Academy propose des cours de langues (Français, Anglais, Arabe, Espagnol, Allemand),
            du soutien scolaire, des formations professionnelles et des compétences transversales.
            Les cours peuvent être en ligne ou en présentiel selon la disponibilité.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Inscription aux Cours</h2>
          <p>
            L&apos;inscription à un cours est soumise à disponibilité. Le nombre de places est limité.
            Une inscription confirmée est considérée comme un engagement. Les annulations sont possibles
            sous certaines conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Paiement</h2>
          <p>
            Les tarifs des cours sont indiqués en Dirham marocain (MAD) et toutes taxes comprises.
            Le paiement doit être effectué lors de l&apos;inscription au cours.
            Les modalités de remboursement sont définies au cas par cas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Protection des Données</h2>
          <p>
            Les données personnelles collectées sont traitées conformément à notre politique de
            confidentialité. Elles ne sont jamais transmises à des tiers sans consentement.
            L&apos;utilisateur peut demander la suppression de son compte et de ses données à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Propriété Intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu du site (textes, images, logos, vidéos) est protégé par le droit
            de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. Responsabilité</h2>
          <p>
            Fresh Start Academy s&apos;efforce d&apos;assurer la disponibilité et la qualité de ses services.
            Toutefois, la plateforme ne saurait être tenue responsable d&apos;éventuelles interruptions
            de service ou d&apos;erreurs techniques.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">9. Modification des CGU</h2>
          <p>
            Fresh Start Academy se réserve le droit de modifier les présentes CGU à tout moment.
            Les utilisateurs seront informés des modifications via le site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">10. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter via
            notre <Link to="/contact" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">page de contact</Link>.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dernière mise à jour : Mars 2026
        </p>
      </div>
    </div>
  );
};

export default Terms;
