# Solia IAAS Product Summary

## 1. Modules fondamentaux (V1)

### Objectif
Créer une version fonctionnelle, sécurisée et évolutive avec les rôles suivants :
- ONG / Association
- Donateur
- Auto-entrepreneur (recruteur)
- Entreprise de fundraising
- Entité centrale (admin national)

### Architecture des rôles et espaces

| Rôle                       | Accès principal                          | Business model             | Particularités                         |
| -------------------------- | ---------------------------------------- | -------------------------- | -------------------------------------- |
| ONG                        | Espace ONG personnalisé                  | Abonnement mensuel         | Voir ses campagnes, ses donateurs      |
| Donateur                   | Espace personnel avec historique         | Gratuit                    | Suivi des dons, documents, reçu fiscal |
| Auto-entrepreneur          | Espace terrain (mobile/web)              | Commission sur chaque don  | Planning, rapport, synchronisation     |
| Entreprise fundraising     | Interface partenaire avec statistiques   | Paiement à la performance  | Missions multiples, gestion d’équipe   |
| Entité centrale            | Backoffice total + gestion contractuelle | Commission & orchestration | Gère les contrats, API, conformité     |

## 2. Modules clés à développer pour la V1

- Authentification & Autorisation
  - Multi-tenant, JWT + RBAC, Invitations par rôle, KYC
- Gestion des entités
  - Users, Organizations, Donations, Missions, Documents KYC
- Planning & géolocalisation
  - Création de mission, Affectation, Pointage terrain
- Paiement & SEPA
  - Stripe Connect, Mandat + signature, Répartition automatique
- API publique
  - Auth OAuth 2, Endpoints documentés, Webhooks
- Conformité & audit
  - Journal d’audit, Stockage consentements, Export RGPD

## 3. Scénarios Postman / API

- Flow ONG: signup, upload KYC, missions, donations
- Flow Auto-entrepreneur: signup, missions today, daily report
- Flow Donateur: donate, SEPA mandate, history, receipt
- Flow Admin central: contracts, API integrations, audit logs

## 4. Roadmap produit simplifiée

| Version | Objectifs                                           | Délais estimés |
| ------- | --------------------------------------------------- | -------------- |
| V1      | Auth, rôle, missions, dons, dashboard ONG & terrain | 4–6 semaines   |
| V2      | App mobile PWA, Stripe SEPA, module formation       | 6–8 semaines   |
| V3      | API publique, Academy, moteur IA de matching        | 8–10 semaines  |
| V4      | Interconnexions CRM, HelloAsso, SDK mobile          | 10–12 semaines |

---

Ce document peut être utilisé pour présenter le produit aux partenaires et ONG.
