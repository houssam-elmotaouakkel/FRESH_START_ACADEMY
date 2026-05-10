# Fresh Start Academy - Backend

> API REST pour la plateforme Fresh Start Academy

---

## Technologies

- **Runtime:** Node.js 20.x
- **Framework:** Express 5.x
- **ORM:** Prisma 5.x
- **Base de données:** MySQL 8.x
- **Cache:** Redis (ioredis)
- **Authentification:** JWT + bcryptjs (prêt, non exposé)
- **Validation:** Zod 4.x
- **Emails:** Nodemailer
- **Sécurité:** helmet, cors, express-rate-limit, xss
- **Images:** sharp + multer
- **Chiffrement:** crypto (utilitaires internes)
- **2FA (TOTP):** otplib + qrcode (prêt, non exposé)
- **Logs:** Winston
- **Cron:** nettoyage automatique des tokens expirés

## Installation

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

## Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start

# Tests
npm test
npm run test:smoke
```

Le serveur démarre sur `http://localhost:5000`

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@localhost:3306/fresh_start` |
| `REDIS_URL` | URL Redis (optionnel) | `redis://localhost:6379` |
| `JWT_SECRET` | Secret pour les tokens JWT | `votre-secret-super-securise` |
| `JWT_REFRESH_SECRET` | Secret pour refresh tokens | `autre-secret-securise` |
| `JWT_EXPIRES_IN` | Durée du token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Durée du refresh token | `7d` |
| `PORT` | Port du serveur | `5000` |
| `NODE_ENV` | Environnement | `development` |
| `CORS_ORIGIN` | URL frontend (CORS) | `http://localhost:5173` |
| `MAIL_HOST` | Hôte SMTP | `smtp.example.com` |
| `MAIL_PORT` | Port SMTP | `587` |
| `MAIL_USER` | Utilisateur SMTP | `contact@freshstart.ma` |
| `MAIL_PASS` | Mot de passe SMTP | `...` |
| `MAIL_FROM` | Expéditeur | `Fresh Start Academy <contact@freshstart.ma>` |
| `CONTACT_RECIPIENT` | Destinataire des messages | `admin@freshstart.ma` |

## Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Schéma de base de données
├── logs/
│   ├── combined.log               # Logs combinés
│   └── error.log                  # Logs d'erreurs
├── uploads/                       # Fichiers uploadés (images)
├── src/
│   ├── config/
│   │   ├── index.js               # Export de la configuration
│   │   └── database.js            # Connexion Prisma + Redis
│   ├── controllers/
│   │   └── contactController.js   # Contrôleur formulaire de contact
│   ├── cron/
│   │   └── tokenCleanup.js        # Nettoyage des tokens expirés
│   ├── middlewares/
│   │   ├── index.js               # Export des middlewares
│   │   ├── errorHandler.js        # Gestion centralisée des erreurs
│   │   ├── rateLimiter.js         # Limitation de requêtes
│   │   ├── requestLogger.js       # Logging des requêtes HTTP
│   │   └── validate.js            # Middleware validation Zod
│   ├── routes/
│   │   ├── apiRouter.js           # Routeur principal API
│   │   └── contactRoutes.js       # Routes formulaire de contact
│   ├── services/
│   │   └── contactService.js      # Logique métier + envoi d'email
│   ├── utils/
│   │   ├── apiResponse.js         # Formatage des réponses API
│   │   ├── encryption.js          # Utilitaires de chiffrement
│   │   ├── helpers.js             # Fonctions utilitaires
│   │   ├── imageProcessor.js      # Traitement d'images (sharp)
│   │   ├── logger.js              # Configuration Winston
│   │   ├── mailer.js              # Client Nodemailer
│   │   └── sanitize.js            # Nettoyage des entrées (xss)
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── contactValidator.js
│   │   ├── courseValidator.js
│   │   ├── enrollmentValidator.js
│   │   ├── adminMetricsValidator.js
│   │   ├── publicValidator.js
│   │   ├── testimonialValidator.js
│   │   └── userValidator.js
│   ├── app.js                     # Configuration Express
│   └── server.js                  # Point d'entrée du serveur
├── tests/
│   └── app.test.js
├── .env.example
├── package.json
└── package-lock.json
```

## API Endpoints actifs

### Formulaire de contact (`/api/contacts`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/contacts` | Envoyer un message de contact | Non |

### Health check

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Statut de l'API |

## Validators disponibles (prêts pour extension)

Les validators Zod suivants sont implémentés et prêts à être utilisés quand les routes correspondantes seront activées :

- `authValidator.js` — inscription, connexion, refresh token
- `userValidator.js` — mise à jour du profil
- `courseValidator.js` — création/modification de cours
- `enrollmentValidator.js` — inscription à un cours
- `testimonialValidator.js` — soumission de témoignages
- `adminMetricsValidator.js` — filtres métriques admin
- `publicValidator.js` — routes publiques

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer en mode dev (nodemon) |
| `npm start` | Démarrer en production |
| `npm run lint` | Vérifier le code |
| `npm test` | Lancer les tests (Jest) |
| `npm run test:smoke` | Tests smoke API |

## Commandes Prisma

```bash
npx prisma studio      # Interface graphique BDD
npx prisma db push     # Synchroniser le schéma
npx prisma generate    # Générer le client
npx prisma db seed     # Insérer les données de test
```
