# 🔧 Fresh Start Academy - Backend

> API REST pour la plateforme Fresh Start Academy

---

## 🛠 Technologies

- **Runtime:** Node.js 20.x
- **Framework:** Express 5.x
- **ORM:** Prisma 5.x
- **Base de données:** MySQL 8.x
- **Authentification:** JWT (access + refresh tokens)
- **Validation:** Zod
- **Sécurité:** bcrypt, helmet, cors

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec vos paramètres

# Générer le client Prisma
npx prisma generate

# Créer les tables dans la BDD
npx prisma db push

# (Optionnel) Seed des données de test
npx prisma db seed
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## ⚙️ Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@localhost:3306/fresh_start_academy` |
| `JWT_SECRET` | Secret pour les tokens JWT | `votre-secret-super-securise` |
| `JWT_REFRESH_SECRET` | Secret pour refresh tokens | `autre-secret-securise` |
| `JWT_EXPIRES_IN` | Durée du token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Durée du refresh token | `7d` |
| `PORT` | Port du serveur | `5000` |
| `NODE_ENV` | Environnement | `development` |
| `CORS_ORIGIN` | URL frontend (CORS) | `http://localhost:5173` |

## 📁 Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Schéma de base de données
├── logs/
│   ├── combined.log               # Logs combinés
│   └── error.log                  # Logs d'erreurs
├── uploads/                       # Fichiers uploadés
├── src/
│   ├── config/                    # Configuration
│   │   ├── index.js               # Export de la configuration
│   │   └── database.js            # Connexion à la base de données
│   ├── controllers/               # Logique des endpoints
│   │   ├── authController.js      # Contrôleur authentification
│   │   ├── userController.js      # Contrôleur utilisateurs
│   │   ├── courseController.js    # Contrôleur cours
│   │   ├── enrollmentController.js # Contrôleur inscriptions
│   │   ├── contactController.js   # Contrôleur contacts
│   │   └── testimonialController.js # Contrôleur témoignages
│   ├── middlewares/               # Auth, validation, errors
│   │   ├── index.js               # Export des middlewares
│   │   ├── auth.js                # Middleware authentification
│   │   ├── validate.js            # Middleware validation
│   │   ├── errorHandler.js        # Gestion des erreurs
│   │   └── rateLimiter.js         # Limitation de requêtes
│   ├── routes/                    # Définition des routes
│   │   ├── apiRouter.js           # Routeur principal API
│   │   ├── authRoutes.js          # Routes authentification
│   │   ├── userRoutes.js          # Routes utilisateurs
│   │   ├── courseRoutes.js        # Routes cours
│   │   ├── enrollmentRoutes.js    # Routes inscriptions
│   │   ├── contactRoutes.js       # Routes contacts
│   │   └── testimonialRoutes.js   # Routes témoignages
│   ├── services/                  # Logique métier
│   │   ├── authService.js         # Service authentification
│   │   ├── userService.js         # Service utilisateurs
│   │   ├── courseService.js       # Service cours
│   │   ├── enrollmentService.js   # Service inscriptions
│   │   ├── contactService.js      # Service contacts
│   │   └── testimonialService.js  # Service témoignages
│   ├── validators/                # Schémas Zod
│   │   ├── authValidator.js       # Validation authentification
│   │   ├── userValidator.js       # Validation utilisateurs
│   │   ├── courseValidator.js     # Validation cours
│   │   ├── enrollmentValidator.js # Validation inscriptions
│   │   ├── contactValidator.js    # Validation contacts
│   │   └── testimonialValidator.js # Validation témoignages
│   ├── utils/                     # Helpers
│   │   ├── apiResponse.js         # Formatage des réponses API
│   │   ├── helpers.js             # Fonctions utilitaires
│   │   └── logger.js              # Configuration du logger
│   ├── app.js                     # Configuration Express
│   └── server.js                  # Point d'entrée du serveur
├── .env.example                   # Variables d'environnement exemple
├── .gitignore                     # Fichiers ignorés par Git
├── package.json                   # Dépendances et scripts
└── package-lock.json              # Versions exactes des dépendances
```

## 🔌 API Endpoints

### 🔐 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription | ❌ |
| POST | `/login` | Connexion | ❌ |
| POST | `/refresh-token` | Rafraîchir le token | ❌ |
| POST | `/logout` | Déconnexion | ✅ |
| GET | `/me` | Utilisateur connecté | ✅ |

### 👥 Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des utilisateurs | Admin |
| GET | `/:id` | Détail utilisateur | Admin |
| PUT | `/:id` | Modifier utilisateur | Admin |
| DELETE | `/:id` | Supprimer utilisateur | Admin |
| GET | `/profile` | Mon profil | ✅ |
| PUT | `/profile` | Modifier mon profil | ✅ |

### 📚 Cours (`/api/courses`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des cours | ❌ |
| GET | `/:id` | Détail d'un cours | ❌ |
| POST | `/` | Créer un cours | Admin |
| PUT | `/:id` | Modifier un cours | Admin |
| DELETE | `/:id` | Supprimer un cours | Admin |

### 📝 Inscriptions (`/api/enrollments`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/my` | Mes inscriptions | ✅ |
| POST | `/` | S'inscrire à un cours | ✅ |
| GET | `/` | Liste (admin) | Admin |
| PUT | `/:id/status` | Changer le statut | Admin |

### 💬 Contacts (`/api/contacts`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/` | Envoyer un message | ❌ |
| GET | `/` | Liste des messages | Admin |
| GET | `/:id` | Détail message | Admin |
| PUT | `/:id/status` | Changer le statut | Admin |
| DELETE | `/:id` | Supprimer | Admin |

### ⭐ Témoignages (`/api/testimonials`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste approuvés | ❌ |
| POST | `/` | Soumettre | ❌ |
| GET | `/admin` | Tous (admin) | Admin |
| PUT | `/:id/approve` | Approuver | Admin |
| DELETE | `/:id` | Supprimer | Admin |

## 🗄 Base de données

### Modèles

- **User** - Utilisateurs (STUDENT, TEACHER, ADMIN)
- **Course** - Cours (catégorie, niveau, prix, durée)
- **Enrollment** - Inscriptions (user ↔ course)
- **Contact** - Messages de contact
- **Testimonial** - Témoignages
- **Setting** - Paramètres du site

### Commandes Prisma

```bash
npx prisma studio      # Interface graphique
npx prisma db push     # Synchroniser le schéma
npx prisma generate    # Générer le client
npx prisma db seed     # Insérer les données de test
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer en mode dev (nodemon) |
| `npm start` | Démarrer en production |
| `npm run lint` | Vérifier le code |
| `npm test` | Lancer les tests |
| `npm run test:smoke` | Lancer les tests smoke API |
