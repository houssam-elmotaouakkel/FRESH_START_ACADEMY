# Fresh Start Academy

> Site vitrine d'un centre de langues et communication — Français, Anglais, Arabe, Espagnol, Allemand...

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## À propos

**Fresh Start Academy** est un site vitrine pour un centre de langues basé à Rabat. La plateforme présente les offres du centre, permet aux visiteurs de contacter l'équipe, et dispose d'une architecture backend prête à évoluer vers des fonctionnalités complètes (inscriptions, espace utilisateur, panel admin).

## Fonctionnalités actuelles

- Page d'accueil avec sections marketing (hero, cours, témoignages, tarifs, CTA)
- Formulaire de contact fonctionnel (avec envoi d'email via Nodemailer)
- Page Mentions légales / CGU
- Internationalisation (FR / EN / AR) avec i18next
- Mode sombre / clair (Zustand + localStorage)
- SEO optimisé (react-helmet-async, JSON-LD, sitemap)
- Animations fluides (Framer Motion)
- Design responsive Tailwind CSS 4

## Stack Technique

| Frontend | Backend | Base de données |
|----------|---------|-----------------|
| React 19 | Node.js 20 | MySQL 8 |
| Vite 7 (rolldown) | Express 5 | Prisma ORM |
| Tailwind CSS 4 | Nodemailer | Redis (ioredis) |
| Zustand 5 | Zod 4 | |
| Framer Motion | JWT / bcrypt | |
| i18next | Winston | |
| react-helmet-async | | |

## Démarrage rapide

### Prérequis

- Node.js 20+
- MySQL 8+
- Redis (optionnel pour le cache)
- npm

### Installation

```bash
# Cloner le repository
git clone https://github.com/houssam-elmotaouakkel/FRESH_START_ACADEMY.git
cd FRESH_START_ACADEMY

# Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Éditer les fichiers .env avec vos paramètres

# Initialiser la base de données
cd backend
npx prisma generate
npx prisma db push

# Démarrer les serveurs (dans 2 terminaux)
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Accès

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

## Structure du projet

```
FRESH_START_ACADEMY/
├── frontend/          # Application React
├── backend/           # API Express
├── _archive/          # Ancienne version HTML (référence)
└── README.md
```

## Documentation détaillée

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Auteur

**Houssam El Motaouakkel** — [@houssam-elmotaouakkel](https://github.com/houssam-elmotaouakkel)

## License

MIT License — voir [LICENSE](LICENSE) pour plus de détails.
