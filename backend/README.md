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
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:5173` |

## 📁 Structure

```
backend/
├── src/
│   ├── config/           # Configuration (env, database)
│   ├── controllers/      # Logique des endpoints
│   ├── middlewares/      # Auth, validation, errors
│   ├── routes/           # Définition des routes
│   ├── services/         # Logique métier
│   ├── validators/       # Schémas Zod
│   ├── utils/            # Helpers
│   └── app.js            # Point d'entrée Express
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   └── seed.js           # Données initiales
├── .env.example
└── package.json
```

## 🔌 API Endpoints

### 🔐 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription | ❌ |
| POST | `/login` | Connexion | ❌ |
| POST | `/refresh` | Rafraîchir le token | ❌ |
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
| GET | `/all` | Tous (admin) | Admin |
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
