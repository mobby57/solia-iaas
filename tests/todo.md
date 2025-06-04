# ✅ TO-DO LIST – TESTS À EFFECTUER SUR SOLIA

---

## 🔐 AUTHENTIFICATION & MULTI-TENANT

- [ ] Vérifier que chaque requête utilise un `tenantId` valide  
- [ ] Rejeter toute requête sans `tenantId`  
- [ ] Rejeter toute tentative d'accès à une ressource d’un autre tenant  

---

## 👤 USER SERVICE

- [ ] Créer un utilisateur avec `tenantId`  
- [ ] Empêcher la création d’un user sans `tenantId`  
- [ ] Lister les utilisateurs du `tenantId`  
- [ ] Ne pas voir les utilisateurs d’un autre tenant  
- [ ] Mettre à jour un user (même tenant uniquement)  
- [ ] Supprimer un user (même tenant uniquement)  

---

## 🏢 ORGANIZATION SERVICE

- [ ] Créer une organization liée au `tenantId`  
- [ ] Lister toutes les organizations d’un tenant  
- [ ] Empêcher l’accès aux organizations d’un autre tenant  
- [ ] Mettre à jour / Supprimer une organization avec vérification du `tenantId`  

---

## 💸 DONATION SERVICE

- [x] Créer une donation liée à un user et une organization du même `tenantId`  
- [x] Empêcher la création de donation sans user ou organization valides  
- [x] Empêcher la connexion d’un `user` d’un tenant avec une `organization` d’un autre tenant  
- [x] Lister les donations d’un tenant uniquement  
- [x] Modifier une donation du même tenant  
- [x] Supprimer une donation (même tenant uniquement)  

---

## 📅 TASK SERVICE

- [ ] Créer une tâche pour un opérateur (user) dans le même tenant  
- [ ] Lister les tâches liées à un `tenantId`  
- [ ] Vérifier que les tâches d’un autre tenant sont inaccessibles  
- [ ] Mettre à jour / Supprimer une tâche dans le bon tenant  

---

## 🧭 MISSION SERVICE

- [ ] Créer une mission dans un tenant  
- [ ] Lister les missions du tenant  
- [ ] Empêcher toute manipulation inter-tenant  
- [ ] Associer une donation ou un user à une mission dans le bon tenant uniquement  

---

## 💬 COMMENT / TAG SERVICE

- [ ] Créer un commentaire ou tag attaché à une entité (user, donation, etc.) dans le même tenant  
- [ ] Empêcher les tags/commentaires inter-tenant  
- [ ] Lister, modifier, supprimer dans les limites du tenant  

---

## 📜 AUDIT LOGS (si activés)

- [ ] Vérifier que `createdBy`, `updatedBy`, `updatedAt` sont correctement peuplés  
- [ ] Vérifier que ces métadonnées respectent le contexte du `tenantId`  

---

## 🧪 INTÉGRATION GLOBALE

- [ ] Scénario E2E : Créer un user + orga + donation + mission + task → Valider l'isolation tenant  
- [ ] Scénario E2E négatif : Utiliser un mauvais tenantId → Échec attendu
