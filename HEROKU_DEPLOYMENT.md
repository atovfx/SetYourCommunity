# 🚀 Déploiement sur Heroku - Guide Complet

## ✅ Prérequis

- ✅ Compte GitHub configuré
- ✅ Dépôt GitHub : https://github.com/atovfx/SetYourCommunity
- ✅ Compte Heroku (gratuit disponible)
- ✅ Heroku CLI installé (optionnel mais recommandé)

---

## 📋 Méthode 1 : Via Dashboard Heroku (Recommandé)

### Étape 1 : Créer l'Application Heroku

1. **Connectez-vous** sur https://dashboard.heroku.com
2. Cliquez sur **"New"** → **"Create new app"**
3. Remplissez :
   - **App name** : `setyourcommunity` (ou votre choix, doit être unique)
   - **Region** : United States (ou Europe si vous préférez)
   - Cliquez sur **"Create app"**

### Étape 2 : Connecter GitHub

1. Dans votre app Heroku, allez dans l'onglet **"Deploy"**
2. Section **"Deployment method"** → Cliquez sur **"GitHub"**
3. Cliquez sur **"Connect to GitHub"** et autorisez Heroku
4. Recherchez votre dépôt : `atovfx/SetYourCommunity`
5. Cliquez sur **"Connect"**

### Étape 3 : Configurer le Déploiement

**Option A : Auto-deploy (Recommandé)**
- Activez **"Enable Automatic Deploys"**
- Sélectionnez la branche `main`
- Heroku déploiera automatiquement à chaque push sur `main`

**Option B : Déploiement manuel**
- Cliquez sur **"Deploy Branch"** dans la section **"Manual deploy"**
- Sélectionnez la branche `main`
- Cliquez sur **"Deploy"**

### Étape 4 : Ajouter PostgreSQL

1. Dans votre app Heroku, allez dans l'onglet **"Resources"**
2. Cherchez **"Add-ons"** → Recherchez **"Heroku Postgres"**
3. Cliquez sur **"Heroku Postgres"** → Plan **"Mini"** (gratuit pour test) ou **"Basic"** ($9/mois)
4. Cliquez sur **"Provision"**

PostgreSQL sera ajouté et la variable `DATABASE_URL` sera automatiquement configurée.

### Étape 5 : Configurer les Variables d'Environnement

1. Dans votre app Heroku, allez dans **"Settings"**
2. Section **"Config Vars"** → Cliquez sur **"Reveal Config Vars"**
3. Ajoutez toutes vos variables d'environnement :

```
DATABASE_URL                    (déjà ajouté par Postgres addon)
JWT_SECRET                      votre-secret-jwt-fort-et-unique
JWT_EXPIRES_IN                  7d
OPENAI_API_KEY                  sk-votre-cle-openai
INSTAGRAM_APP_ID                votre-app-id-instagram
INSTAGRAM_APP_SECRET            votre-app-secret-instagram
INSTAGRAM_REDIRECT_URI          https://votre-app-name.herokuapp.com/auth/meta/callback
WHATSAPP_BUSINESS_ACCOUNT_ID    votre-business-account-id
WHATSAPP_ACCESS_TOKEN           votre-access-token-whatsapp
WHATSAPP_PHONE_NUMBER_ID        votre-phone-number-id
WHATSAPP_VERIFY_TOKEN           votre-verify-token-secret
GOOGLE_CLIENT_ID                votre-google-client-id
GOOGLE_CLIENT_SECRET            votre-google-client-secret
GOOGLE_CALLBACK_URL             https://votre-app-name.herokuapp.com/api/auth/google/callback
FRONTEND_URL                    https://app.setyourcommunity.fun (ou votre domaine)
NODE_ENV                        production
PORT                            (Heroku définit automatiquement, mais mettez 4000 par défaut)
```

⚠️ **Important** : Remplacez toutes les valeurs `votre-...` par vos vraies valeurs.

### Étape 6 : Exécuter les Migrations Prisma

**Option A : Automatique (recommandé)**
Votre `Procfile` contient déjà :
```
release: npx prisma migrate deploy
```
Les migrations s'exécuteront automatiquement à chaque déploiement.

**Option B : Manuelle**
1. Dans Heroku Dashboard → Votre app → **"More"** → **"Run console"**
2. Ou via CLI :
```bash
heroku run npx prisma migrate deploy
```

### Étape 7 : Buildpack Node.js

Heroku détecte automatiquement Node.js. Vérifiez dans **"Settings"** → **"Buildpacks"** :
- `heroku/nodejs` doit être présent

### Étape 8 : Déployer

Si vous avez activé l'auto-deploy, un push sur `main` déclenchera le déploiement.
Sinon, cliquez sur **"Deploy Branch"** dans l'onglet **"Deploy"**.

### Étape 9 : Vérifier le Déploiement

1. Une fois déployé, cliquez sur **"Open app"** ou visitez `https://votre-app-name.herokuapp.com`
2. Vérifiez l'endpoint health :
```
https://votre-app-name.herokuapp.com/health
```
Devrait retourner : `{"status":"ok","timestamp":"..."}`

---

## 📋 Méthode 2 : Via Heroku CLI (Alternative)

### Installer Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Vérifier l'installation
heroku --version
```

### Se Connecter

```bash
heroku login
```

### Créer l'Application

```bash
cd /Users/ato/Documents/SetYourcommunity

# Créer l'app (remplacez le nom si nécessaire)
heroku create setyourcommunity

# OU si votre app existe déjà, ajouter le remote
heroku git:remote -a setyourcommunity
```

### Ajouter PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

### Configurer les Variables d'Environnement

```bash
heroku config:set JWT_SECRET="votre-secret-jwt"
heroku config:set JWT_EXPIRES_IN="7d"
heroku config:set OPENAI_API_KEY="sk-votre-cle"
heroku config:set INSTAGRAM_APP_ID="votre-app-id"
heroku config:set INSTAGRAM_APP_SECRET="votre-app-secret"
heroku config:set INSTAGRAM_REDIRECT_URI="https://votre-app-name.herokuapp.com/auth/meta/callback"
heroku config:set WHATSAPP_BUSINESS_ACCOUNT_ID="votre-id"
heroku config:set WHATSAPP_ACCESS_TOKEN="votre-token"
heroku config:set WHATSAPP_PHONE_NUMBER_ID="votre-phone-id"
heroku config:set WHATSAPP_VERIFY_TOKEN="votre-token"
heroku config:set GOOGLE_CLIENT_ID="votre-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="votre-client-secret"
heroku config:set GOOGLE_CALLBACK_URL="https://votre-app-name.herokuapp.com/api/auth/google/callback"
heroku config:set FRONTEND_URL="https://app.setyourcommunity.fun"
heroku config:set NODE_ENV="production"
```

### Vérifier les Variables

```bash
heroku config
```

### Déployer

```bash
# Déployer la branche main
git push heroku main

# Voir les logs en temps réel
heroku logs --tail
```

### Exécuter les Migrations

```bash
heroku run npx prisma migrate deploy
```

---

## 🏗️ Structure du Projet pour Heroku

Votre projet est déjà configuré correctement :

### ✅ Procfile
```
web: npm run start
release: npx prisma migrate deploy
```

### ✅ package.json
- Script `build` : TypeScript → JavaScript
- Script `start` : Lance `dist/server.js`
- Engines : Node.js >= 18.0.0

### ✅ Configuration Backend

Votre `server.ts` écoute sur `process.env.PORT` (Heroku définit automatiquement).

---

## 🔧 Configuration Heroku Buildpacks

Si besoin, configurez manuellement :

```bash
# Node.js (déjà détecté automatiquement)
heroku buildpacks:set heroku/nodejs

# Si vous voulez vérifier
heroku buildpacks
```

---

## 📝 Checklist Déploiement

### Avant le Déploiement
- [ ] Compte Heroku créé
- [ ] App Heroku créée
- [ ] Dépôt GitHub connecté
- [ ] PostgreSQL addon ajouté
- [ ] Toutes les variables d'environnement configurées
- [ ] `Procfile` présent et correct
- [ ] `package.json` avec scripts `build` et `start`
- [ ] Code poussé sur GitHub (branche `main`)

### Après le Déploiement
- [ ] App accessible : `https://votre-app-name.herokuapp.com`
- [ ] Health check fonctionne : `/health` retourne OK
- [ ] Migrations Prisma exécutées
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Test de connexion Instagram possible
- [ ] URLs Meta Dashboard mises à jour (production)

---

## 🐛 Dépannage

### Erreur : "App crashed"

**Vérifier les logs** :
```bash
heroku logs --tail
```

**Causes communes** :
- Variables d'environnement manquantes
- Base de données non migrée
- Erreur de build TypeScript
- Port mal configuré

### Erreur : "Database not found"

```bash
# Vérifier que Postgres est bien ajouté
heroku addons

# Exécuter les migrations
heroku run npx prisma migrate deploy
```

### Erreur : "Build failed"

Vérifiez que :
- `package.json` contient `"engines": {"node": ">=18.0.0"}`
- Scripts `build` et `start` existent
- `tsconfig.json` est configuré correctement

### Erreur : "Cannot find module"

```bash
# Régénérer Prisma Client
heroku run npx prisma generate
```

### Voir les Variables d'Environnement

```bash
heroku config
```

### Redémarrer l'App

```bash
heroku restart
```

---

## 🔗 URLs de Production

Une fois déployé, mettez à jour :

### Meta Dashboard
- **Valid OAuth Redirect URIs** :
  ```
  https://votre-app-name.herokuapp.com/auth/meta/callback
  ```
- **Deauthorization URL** :
  ```
  https://votre-app-name.herokuapp.com/auth/meta/deauthorize
  ```
- **Data Deletion URL** :
  ```
  https://votre-app-name.herokuapp.com/privacy/delete
  ```

### Google OAuth
- **Authorized redirect URIs** :
  ```
  https://votre-app-name.herokuapp.com/api/auth/google/callback
  ```

### Webhooks (si configurés)
- Instagram : `https://votre-app-name.herokuapp.com/api/webhooks/instagram`
- WhatsApp : `https://votre-app-name.herokuapp.com/api/webhooks/whatsapp`

---

## 📊 Monitoring

### Voir les Logs en Temps Réel

```bash
heroku logs --tail
```

### Voir les Logs Historiques

Sur Heroku Dashboard → Votre app → **"More"** → **"View logs"**

### Métriques

Sur Heroku Dashboard → Votre app → **"Metrics"**

---

## 🔄 Déploiement Continu

Une fois l'auto-deploy activé :

1. Faites vos modifications en local
2. Committez et poussez sur `main` :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```
3. Heroku déploiera automatiquement
4. Surveillez les logs : `heroku logs --tail`

---

## 💡 Astuces

### Environnement Local vs Production

Dans votre code, utilisez :
```typescript
const port = process.env.PORT || 4000; // Heroku définit PORT automatiquement
```

### Base de Données Locale vs Production

Prisma utilise automatiquement `DATABASE_URL` :
- Local : `postgresql://user:pass@localhost:5432/db`
- Heroku : Configuré automatiquement par l'addon

### Secrets

⚠️ **JAMAIS** de secrets dans le code source !
- Utilisez toujours les **Config Vars** Heroku
- Ne committez jamais `.env` (déjà dans `.gitignore`)

---

## 🎯 Commandes Rapides

```bash
# Déployer
git push heroku main

# Voir les logs
heroku logs --tail

# Ouvrir l'app
heroku open

# Console Heroku (shell)
heroku run bash

# Exécuter une commande
heroku run npm run prisma:studio  # (via VPN si nécessaire)

# Redémarrer
heroku restart

# Voir la config
heroku config

# Voir les addons
heroku addons
```

---

**Une fois déployé, votre application sera accessible sur `https://votre-app-name.herokuapp.com` ! 🎉**

