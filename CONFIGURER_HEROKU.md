# ⚙️ Configurer les Variables d'Environnement Heroku

## ✅ Déploiement Réussi !

Votre code est déployé sur Heroku, mais l'app crash car des variables d'environnement sont manquantes.

---

## 🔧 Configuration Immédiate (Minimum)

Pour que l'app démarre, configurez au minimum :

### 1. Variables Essentielles

```bash
# JWT Secret (générez un secret fort)
heroku config:set JWT_SECRET="$(openssl rand -hex 32)" -a setyourcommunity

# OpenAI API Key (obligatoire pour l'app)
heroku config:set OPENAI_API_KEY="sk-votre-cle-openai" -a setyourcommunity

# Environnement
heroku config:set NODE_ENV="production" -a setyourcommunity
```

**Note** : `DATABASE_URL` est déjà configuré automatiquement par l'addon PostgreSQL.

### 2. Redémarrer l'App

```bash
heroku restart -a setyourcommunity
```

### 3. Vérifier que ça démarre

```bash
# Voir les logs
heroku logs --tail -a setyourcommunity

# Tester l'endpoint
curl https://setyourcommunity.herokuapp.com/health
```

---

## 📋 Variables Complètes (Recommandé)

Pour une configuration complète, ajoutez toutes ces variables :

```bash
# JWT
heroku config:set JWT_SECRET="votre-secret-jwt-fort-et-unique" -a setyourcommunity
heroku config:set JWT_EXPIRES_IN="7d" -a setyourcommunity

# OpenAI
heroku config:set OPENAI_API_KEY="sk-votre-cle-openai" -a setyourcommunity

# Instagram Graph API
heroku config:set INSTAGRAM_APP_ID="votre-app-id-instagram" -a setyourcommunity
heroku config:set INSTAGRAM_APP_SECRET="votre-app-secret-instagram" -a setyourcommunity
heroku config:set INSTAGRAM_REDIRECT_URI="https://setyourcommunity.herokuapp.com/auth/meta/callback" -a setyourcommunity

# WhatsApp Business API (optionnel pour démarrer)
heroku config:set WHATSAPP_BUSINESS_ACCOUNT_ID="votre-business-account-id" -a setyourcommunity
heroku config:set WHATSAPP_ACCESS_TOKEN="votre-access-token" -a setyourcommunity
heroku config:set WHATSAPP_PHONE_NUMBER_ID="votre-phone-number-id" -a setyourcommunity
heroku config:set WHATSAPP_VERIFY_TOKEN="votre-verify-token" -a setyourcommunity

# Google OAuth (optionnel)
heroku config:set GOOGLE_CLIENT_ID="votre-google-client-id" -a setyourcommunity
heroku config:set GOOGLE_CLIENT_SECRET="votre-google-client-secret" -a setyourcommunity
heroku config:set GOOGLE_CALLBACK_URL="https://setyourcommunity.herokuapp.com/api/auth/google/callback" -a setyourcommunity

# Frontend
heroku config:set FRONTEND_URL="https://app.setyourcommunity.fun" -a setyourcommunity

# Server
heroku config:set NODE_ENV="production" -a setyourcommunity
```

---

## 🔍 Vérifier les Variables Configurées

```bash
# Voir toutes les variables
heroku config -a setyourcommunity

# Voir une variable spécifique
heroku config:get OPENAI_API_KEY -a setyourcommunity
```

---

## 🐛 Problèmes Courants

### App Crash au Démarrage

**Cause** : Variable manquante (comme `OPENAI_API_KEY`)

**Solution** :
1. Voir les logs : `heroku logs --tail -a setyourcommunity`
2. Identifier la variable manquante
3. L'ajouter avec `heroku config:set`
4. Redémarrer : `heroku restart -a setyourcommunity`

### Base de Données Non Connectée

**Solution** :
```bash
# Vérifier que PostgreSQL est bien ajouté
heroku addons -a setyourcommunity

# Voir la DATABASE_URL
heroku config:get DATABASE_URL -a setyourcommunity

# Exécuter les migrations
heroku run npx prisma migrate deploy -a setyourcommunity
```

---

## 📝 Checklist Configuration

- [ ] `JWT_SECRET` configuré
- [ ] `OPENAI_API_KEY` configuré (minimum pour démarrer)
- [ ] `NODE_ENV=production` configuré
- [ ] `DATABASE_URL` présent (automatique)
- [ ] App redémarrée après configuration
- [ ] Health check fonctionne : `/health`
- [ ] Logs vérifiés (pas d'erreurs)

---

## 🚀 Après Configuration

Une fois les variables configurées :

1. **Redémarrez l'app** :
   ```bash
   heroku restart -a setyourcommunity
   ```

2. **Vérifiez les logs** :
   ```bash
   heroku logs --tail -a setyourcommunity
   ```
   
   Vous devriez voir :
   ```
   🚀 Server running on port 4000
   📊 Environment: production
   ```

3. **Testez l'endpoint** :
   ```bash
   curl https://setyourcommunity.herokuapp.com/health
   ```
   
   Devrait retourner : `{"status":"ok","timestamp":"..."}`

---

## 💡 Astuce : Configuration Rapide

Pour configurer rapidement depuis votre `.env` local (attention, adaptez les valeurs) :

```bash
# Lire depuis .env et configurer (exemple)
# ⚠️ Remplacez les valeurs par vos vraies clés !
heroku config:set JWT_SECRET="$(grep JWT_SECRET backend/.env | cut -d '=' -f2)" -a setyourcommunity
```

**Mais mieux** : Copiez manuellement vos vraies valeurs depuis votre `.env` local.

---

**Une fois configuré, votre app sera opérationnelle ! 🎉**

