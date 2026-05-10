# Fresh Start Academy - Frontend

> Interface utilisateur React pour la plateforme Fresh Start Academy

---

## Technologies

- **Framework:** React 19.x
- **Build Tool:** Vite 7.x (rolldown)
- **CSS:** Tailwind CSS 4.x
- **Routing:** React Router 7.x
- **State:** Zustand 5.x
- **HTTP:** Axios
- **Animations:** Framer Motion 12.x
- **i18n:** i18next + react-i18next (FR / EN / AR)
- **SEO:** react-helmet-async
- **Forms:** React Hook Form
- **Notifications:** React Toastify
- **Icons:** React Icons
- **Charts:** Recharts (prêt pour dashboard)
- **Tests:** Vitest + Testing Library

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec l'URL de l'API

# Démarrer en mode développement
npm run dev
```

## Démarrage

```bash
npm run dev        # Mode développement → http://localhost:5173
npm run build      # Build production
npm run preview    # Prévisualiser le build
npm run lint       # Vérifier le code
npm test           # Lancer les tests (Vitest)
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:5000/api` |

## Structure

```
frontend/
├── public/                    # Fichiers statiques
├── src/
│   ├── assets/                # Images, fonts, icons
│   ├── components/
│   │   ├── branding/          # Logo, identité visuelle
│   │   ├── common/
│   │   │   ├── DarkModeToggle.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── JsonLd.jsx         # Données structurées SEO
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   ├── SEO.jsx
│   │   │   └── SeoManager.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   └── ui/
│   │       ├── FormField.jsx
│   │       ├── Modal.jsx
│   │       ├── Pagination.jsx
│   │       ├── PricingCard.jsx
│   │       ├── PrimaryButton.jsx
│   │       ├── SecondaryButton.jsx
│   │       ├── SectionHeader.jsx
│   │       └── TrustBadge.jsx
│   ├── hooks/
│   │   ├── usePageTracking.js     # Tracking de navigation
│   │   └── useSeo.js              # Hook SEO
│   ├── i18n/
│   │   ├── index.js               # Configuration i18next
│   │   └── locales/
│   │       ├── fr.json            # Français
│   │       ├── en.json            # English
│   │       └── ar.json            # العربية
│   ├── lib/                       # Bibliothèques internes
│   ├── pages/
│   │   ├── Home.jsx               # Page d'accueil
│   │   ├── Terms.jsx              # Mentions légales / CGU
│   │   ├── NotFound.jsx           # Page 404
│   │   └── index.js
│   ├── services/
│   │   ├── api.js                 # Instance Axios + interceptors
│   │   └── contactService.js      # Appels API formulaire de contact
│   ├── store/
│   │   ├── themeStore.js          # Mode sombre/clair (Zustand)
│   │   └── uiStore.js             # État UI global
│   ├── styles/                    # Styles globaux
│   ├── test/                      # Configuration des tests
│   ├── utils/
│   │   ├── constants.js
│   │   ├── featureFlags.js        # Feature flags
│   │   ├── helpers.js
│   │   ├── helpers.test.js
│   │   ├── seo.js                 # Utilitaires SEO
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   ├── router.jsx                 # Définition des routes
│   ├── main.jsx
│   └── index.css                  # Styles Tailwind
├── .env.example
├── vite.config.js
├── postcss.config.js
└── package.json
```

## Routes

### Pages publiques

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil |
| `/terms` | Terms | Mentions légales / CGU |
| `*` | NotFound | Page 404 |

## Fonctionnalités

### Internationalisation
3 langues supportées : Français (défaut), English, العربية. Détection automatique de la langue du navigateur. RTL automatique pour l'arabe.

### Mode sombre
Bascule Dark/Light persistée dans `localStorage` via Zustand.

### SEO
- `react-helmet-async` pour les balises `<head>` par page
- `JsonLd.jsx` pour les données structurées (Schema.org)
- Sitemap et robots.txt dans `/public`

### Feature Flags
Fichier `utils/featureFlags.js` pour activer/désactiver des fonctionnalités sans redéploiement.

## Design

### Couleurs (Tailwind)

| Couleur | Usage |
|---------|-------|
| `#81B8F8` | Couleur principale (bleu) |
| `#dde4e9` | Couleur secondaire (gris clair) |
| `#8799d6` | Accent (violet/bleu) |

### Classes personnalisées

```css
.gradient-primary    /* Gradient bleu Fresh Start */
.btn-primary         /* Bouton principal */
.btn-secondary       /* Bouton secondaire */
.card                /* Carte avec ombre */
.spinner             /* Loader de chargement */
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer en mode dev |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérifier le code (ESLint) |
| `npm test` | Lancer les tests (Vitest) |