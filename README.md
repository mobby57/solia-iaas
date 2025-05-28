# 🌍 Solia – Plateforme Cloud de Collecte de Fonds IAaaS

Solia est une solution **IaaS (Infrastructure as a Service)** spécialisée dans la gestion intelligente et automatisée de la collecte de fonds. Elle s'adresse aux opérateurs terrain, aux managers, aux associations et aux donateurs. Elle permet de créer, gérer, suivre et auditer toutes les interactions de fundraising, en temps réel et en multicanal (téléphone, terrain, SMS, etc.).

---

## 🚀 Objectifs du projet

- Créer un **hub cloud scalable et sécurisé** pour la gestion de missions de fundraising.
- Offrir une **expérience fluide et intelligente** aux différents profils utilisateurs (opérateurs, managers, associations, donateurs).
- Garantir la conformité légale (KYC, audit, RGPD).
- Intégrer une **intelligence artificielle native** pour automatiser les tâches, analyser les performances et fluidifier les interactions.

---

## 🧱 Architecture

- **Backend** : Node.js + Fastify
- **ORM** : Prisma avec MongoDB (multi-tenant)
- **Base de données** : MongoDB Atlas
- **Authentification** : JWT + Multi-tenant
- **Déploiement** : Azure (App Service, Cosmos DB si besoin, etc.)
- **CI/CD** : GitHub Actions
- **Infrastructure** : Docker + Docker Compose
- **Notifications** : SMS / Webhooks
- **AI intégrée** : planification, recommandations, automatisation
- **Sécurité** : rate-limiting, audit logs, validations strictes

---

## 📦 Contenu du projet

```
solia/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── tests/
│   └── Dockerfile
├── frontend/ (prochainement)
├── .env
├── docker-compose.yml
└── README.md
```

---

## ✨ Fonctionnalités principales

| Module                | Fonctionnalité                                                                 |
|----------------------|--------------------------------------------------------------------------------|
| Authentification      | Inscription, login, multi-tenant, rôle utilisateur                            |
| Utilisateurs          | CRUD utilisateurs, KYC dynamique, rôles personnalisés                          |
| Missions              | Création/gestion de missions (terrain/téléphone) par opérateur                |
| Tâches (Taskschul)    | Planning, affectation, rappels automatiques                                   |
| Dons (Donations)      | Historique, validation, intégration moyens de paiement                        |
| Système de notification | SMS, email, webhook                                                           |
| IA métier             | Suggestions de tâches, scoring d’impact, audit automatique                    |
| Audit / Logs          | Traçabilité complète, conformité RGPD/KYC                                     |
| Tags / Commentaires   | Système polymorphe, suivi collaboratif                                         |

---

## ⚙️ Installation & lancement

### 1. Cloner le repo

```bash
git clone https://github.com/ton-org/solia.git
cd solia
```

### 2. Configurer les variables d’environnement

Crée un fichier `.env` :

```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="..."
NODE_ENV="development"
PORT=3000
```

### 3. Installer les dépendances et lancer

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🧪 Tests

Les tests unitaires sont réalisés avec `vitest` :

```bash
npm run test
```

---

## ☁️ Déploiement cloud

Solia est pensé pour être **cloud-native** :

* MongoDB Atlas pour les données
* Azure App Services pour le backend
* Azure DevOps / GitHub Actions pour CI/CD
* Containerisation Docker

---

## 🔐 Sécurité & conformité

* Authentification robuste (JWT + hashing)
* Règles strictes d'accès (multi-tenant, RBAC)
* KYC dynamique pour utilisateurs pro
* Logging complet (modifications, accès, IP)
* RGPD : export, anonymisation, consentement

---

## 🧠 IA intégrée

* Génération automatique de tâches
* Suggestions de missions personnalisées
* Détection d’anomalies
* Recommandations d'optimisation

---

## 👤 Espaces utilisateurs

| Rôle        | Accès                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Opérateur   | Planning, missions, feuille de route, saisie des dons                      |
| Manager     | Suivi des équipes, validation KYC, rapport, analyse                        |
| Association | Gestion des campagnes, contrats, facturation                               |
| Donateur    | Historique des dons, préférences, justificatifs, espace personnel sécurisé |

---

## 📈 Suivi produit & feedback

* Intégration future de Mixpanel ou PostHog
* Retours utilisateurs par formulaire embarqué
* Suivi des performances & scoring IA

---

## 📄 License

Ce projet est sous licence MIT.

---

## 👥 Contributeurs

* 👨‍💻 Toi (PDG & développeur principal)
* 🤖 Solia AI (Assistant IA interne)

---

## 📬 Contact

Pour toute question ou collaboration :

📧 [contact@telesaashub.org](mailto:contact@telesaashub.org)  
🌐 [https://telesaashub.org/solia](https://telesaashub.org/solia)  
🧠 [https://gamma.app/solia-ia](https://gamma.app/solia-ia)
