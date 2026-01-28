# 🎨 Fresh Start Academy - Frontend

> Interface utilisateur React pour la plateforme Fresh Start Academy

---

## 🛠 Technologies

- **Framework:** React 19.x
- **Build Tool:** Vite 7.x (rolldown)
- **CSS:** Tailwind CSS 4.x
- **Routing:** React Router 7.x
- **State:** Zustand 5.x
- **HTTP:** Axios
- **Forms:** React Hook Form
- **Notifications:** React Toastify
- **Icons:** React Icons

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec l'URL de l'API

# Démarrer en mode développement
npm run dev
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

L'application démarre sur `http://localhost:5173`

## ⚙️ Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:5000/api` |

## 📁 Structure

```
frontend/
├── public/               # Fichiers statiques
├── src/
│   ├── assets/           # Images, fonts, icons
│   ├── components/
│   │   ├── layout/       # Header, Footer, Layout, AdminLayout
│   │   └── auth/         # ProtectedRoute, AdminRoute
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── MyEnrollments.jsx
│   │   ├── NotFound.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageUsers.jsx
│   │       ├── ManageCourses.jsx
│   │       ├── ManageEnrollments.jsx
│   │       ├── ManageContacts.jsx
│   │       └── ManageTestimonials.jsx
│   ├── services/         # Appels API (Axios)
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── courseService.js
│   │   ├── enrollmentService.js
│   │   ├── contactService.js
│   │   └── testimonialService.js
│   ├── store/            # State management (Zustand)
│   │   ├── authStore.js
│   │   └── uiStore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── router.jsx
│   ├── main.jsx
│   └── index.css         # Styles Tailwind
├── .env.example
├── vite.config.js
├── postcss.config.js
└── package.json
```

## 🗺 Routes

### Pages publiques

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil |
| `/about` | About | À propos |
| `/courses` | Courses | Catalogue des cours |
| `/courses/:id` | CourseDetail | Détail d'un cours |
| `/contact` | Contact | Formulaire de contact |
| `/login` | Login | Connexion |
| `/register` | Register | Inscription |

### Pages protégées (authentifié)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Tableau de bord utilisateur |
| `/profile` | Profile | Mon profil |
| `/my-enrollments` | MyEnrollments | Mes inscriptions |

### Pages admin

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboard | Dashboard admin |
| `/admin/users` | ManageUsers | Gestion utilisateurs |
| `/admin/courses` | ManageCourses | Gestion cours |
| `/admin/enrollments` | ManageEnrollments | Gestion inscriptions |
| `/admin/contacts` | ManageContacts | Gestion messages |
| `/admin/testimonials` | ManageTestimonials | Gestion témoignages |

## 🎨 Design

### Couleurs (Tailwind)

| Couleur | Hex | Usage |
|---------|-----|-------|
| Primary | `#81B8F8` | Couleur principale (bleu) |
| Secondary | `#dde4e9` | Couleur secondaire (gris) |
| Accent | `#8799d6` | Accent (violet/bleu) |

### Classes personnalisées

```css
.gradient-primary    /* Gradient bleu Fresh Start */
.btn-primary         /* Bouton principal */
.btn-secondary       /* Bouton secondaire */
.card                /* Carte avec ombre */
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer en mode dev |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérifier le code |
