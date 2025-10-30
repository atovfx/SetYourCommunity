# ⚡ Déploiement Heroku - Guide Rapide

## 🚀 Étape par Étape (5 minutes)

### 1. Créer l'App Heroku
1. Allez sur https://dashboard.heroku.com/new
2. App name : `setyourcommunity` (ou votre choix)
3. Cliquez **"Create app"**

### 2. Connecter GitHub
1. Onglet **"Deploy"** → **"GitHub"**
2. **"Connect to GitHub"** → Autoriser
3. Recherchez `atovfx/SetYourCommunity` → **"Connect"**
4. Activez **"Enable Automatic Deploys"** (optionnel)
5. Cliquez **"Deploy Branch"** (ou laissez auto-deploy faire)

### 3. Ajouter PostgreSQL
1. Onglet **"Resources"**
2. **"Add-ons"** → Cherchez **"Heroku Postgres"**
3. Plan **"Mini"** (gratuit) ou **"Basic"** ($9/mois)
4. Cliquez **"Provision"**

### 4. Configurer les Variables d'Environnement
1. Onglet **"Settings"** → **"Config Vars"** → **"Reveal Config Vars"**
2. Ajoutez ces variables (remplacez les valeurs) :

```
JWT_SECRET=votre-secret-jwt-fort
OPENAI_API_KEY=sk-votre-cle-openai
INSTAGRAM_APP_ID=votre-app-id
INSTAGRAM_APP_SECRET=votre-app-secret
INSTAGRAM_REDIRECT_URI=https://setyourcommunity.herokuapp.com/auth/meta/callback
FRONTEND_URL=https://app.setyourcommunity.fun
NODE_ENV=production
```

**Note** : `DATABASE_URL` est ajouté automatiquement par l'addon PostgreSQL.

### 5. Vérifier le Déploiement
1. Attendez 2-3 minutes (build en cours)
2. Cliquez sur **"Open app"** ou visitez :
   ```
   https://setyourcommunity.herokuapp.com/health
   ```
3. Devrait retourner : `{"status":"ok"}`

### 6. Exécuter les Migrations (si besoin)
Si les migrations ne se sont pas exécutées automatiquement :
1. **"More"** → **"Run console"**
2. Tapez : `npx prisma migrate deploy`

---

## 📝 Checklist Rapide

- [ ] App Heroku créée
- [ ] GitHub connecté
- [ ] PostgreSQL ajouté
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Health check OK

---

## 🔗 URLs de Production

Une fois déployé, mettez à jour dans **Meta Dashboard** :

```
OAuth Redirect: https://setyourcommunity.herokuapp.com/auth/meta/callback
Deauthorization: https://setyourcommunity.herokuapp.com/auth/meta/deauthorize
Data Deletion: https://setyourcommunity.herokuapp.com/privacy/delete
```

---

## 🐛 Problèmes ?

**App crash ?** → Vérifiez les logs : **"More"** → **"View logs"**

**Variables manquantes ?** → Onglet **"Settings"** → **"Config Vars"**

**Base de données vide ?** → **"More"** → **"Run console"** → `npx prisma migrate deploy`

---

**Pour un guide détaillé, consultez `HEROKU_DEPLOYMENT.md`** 📚

