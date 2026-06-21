# Déploiement (gratuit) — Fresh Start Academy

Architecture déployée :

- **Frontend** (SPA React/Vite) → **Vercel**
- **Backend** (API contact Express + SMTP) → **Render** (plan free)

> ℹ️ Le backend actuel ne contient que le module **formulaire de contact**
> (envoi d'email via SMTP, sans base de données ni Redis). Aucun service MySQL /
> Redis n'est donc nécessaire pour ce déploiement. Les autres pages du frontend
> (auth, cours, admin…) appellent des endpoints qui ne sont pas encore
> implémentés côté serveur : elles ne seront pas fonctionnelles tant que le
> backend correspondant n'est pas ajouté.

---

## 1. Backend → Render

1. Pousser le repo sur GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New → Blueprint** →
   sélectionner ce repo. Render lit automatiquement `render.yaml`.
3. Renseigner les variables marquées secrètes (onglet **Environment**) :

   | Variable        | Valeur                                                        |
   | --------------- | ------------------------------------------------------------- |
   | `CORS_ORIGIN`   | URL exacte du frontend Vercel (ex. `https://xxx.vercel.app`)  |
   | `SMTP_USER`     | Adresse Gmail expéditrice                                      |
   | `SMTP_PASS`     | **App Password** Gmail (16 caractères, pas le vrai mot de passe) |
   | `EMAIL_FROM`    | `Fresh Start Academy <ton-email@gmail.com>`                   |
   | `CONTACT_EMAIL` | Adresse qui reçoit les messages de contact                    |

   `NODE_ENV`, `SMTP_HOST`, `SMTP_PORT` sont déjà fixés par le blueprint.

4. Déployer. L'API sera accessible sur `https://fresh-start-academy-api.onrender.com`.
   Vérifier : `GET /api/health` doit répondre `{"success":true,...}`.

> ⚠️ **Cold start (plan free)** : le service s'endort après ~15 min d'inactivité ;
> la 1ʳᵉ requête après réveil prend ~30-50 s. Normal sur le tier gratuit.

### Gmail — créer un App Password
Compte Google → Sécurité → Validation en 2 étapes (activée) → **Mots de passe
des applications** → générer. Coller le résultat dans `SMTP_PASS`.

---

## 2. Frontend → Vercel

1. [Vercel](https://vercel.com) → **Add New → Project** → importer le repo.
2. **Root Directory : `frontend`** (important — le repo est un monorepo).
   Vercel détecte Vite ; `frontend/vercel.json` gère le reste (fallback SPA + headers).
3. **Environment Variables** → ajouter au minimum :

   | Variable               | Valeur                                                  |
   | ---------------------- | ------------------------------------------------------- |
   | `VITE_API_URL`         | `https://fresh-start-academy-api.onrender.com/api`      |

   Variables optionnelles (carte / SEO) si utilisées :
   `VITE_GOOGLE_MAPS_API_KEY`, `VITE_CENTER_LAT`, `VITE_CENTER_LNG`,
   `VITE_CENTER_LABEL`, `VITE_CENTER_ADDRESS`, `VITE_CENTER_MAP_URL`.

4. Déployer → récupérer l'URL `https://xxx.vercel.app`.

---

## 3. Relier les deux (ordre conseillé)

1. Déployer le **backend** d'abord → noter son URL `onrender.com`.
2. Déployer le **frontend** avec `VITE_API_URL` = URL backend + `/api`.
3. Revenir sur Render → mettre `CORS_ORIGIN` = URL Vercel exacte → **redéployer
   le backend** (les variables sont lues au démarrage).

> Le `VITE_API_URL` est injecté **au build** : après l'avoir changé sur Vercel,
> il faut **relancer un déploiement** du frontend pour qu'il soit pris en compte.

---

## Checklist sécurité (rappel)
- [ ] HTTPS actif (automatique sur Vercel et Render) — §9 du référentiel
- [ ] Secrets uniquement en variables d'env, jamais dans le code — §11.6 / §3.13
- [ ] `CORS_ORIGIN` = origine exacte du frontend (pas de `*`)
- [ ] `SMTP_PASS` = App Password, jamais le mot de passe du compte
