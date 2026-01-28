# 🎓 Fresh Start Academy

> Site web d'un centre de langues et communication - Français, Anglais, Arabe, Espagnol, Allemand...

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 À propos

**Fresh Start Academy** est un site web complet pour un centre de langues. Il permet aux étudiants de découvrir et s'inscrire aux cours, et aux administrateurs de gérer l'ensemble de la plateforme.

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée (JWT)
- 📚 Catalogue de cours avec filtres
- 👤 Espace utilisateur (profil, inscriptions)
- 👨‍💼 Panel d'administration complet
- 📞 Formulaire de contact
- ⭐ Témoignages d'étudiants

## 🛠 Stack Technique

| Frontend | Backend | Base de données |
|----------|---------|-----------------|
| React 19 | Node.js 20 | MySQL 8 |
| Vite 7 | Express 5 | Prisma ORM |
| Tailwind CSS 4 | JWT | |
| Zustand | Zod | |

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- MySQL 8+
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
# Copier .env.example vers .env dans backend/ et frontend/

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

## 📁 Structure

```
FRESH_START_ACADEMY/
├── frontend/          # Application React
├── backend/           # API Express
├── _archive/          # Ancienne version HTML (référence)
└── README.md
```

## 📖 Documentation détaillée

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## 👨‍💻 Auteur

**Houssam Elmotaouakkel** - [@houssam-elmotaouakkel](https://github.com/houssam-elmotaouakkel)

## 📝 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

