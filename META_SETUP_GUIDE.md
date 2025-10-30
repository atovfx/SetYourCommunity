# 📱 Guide de Configuration Meta (Instagram & WhatsApp)

## 🎯 Configuration Instagram Business API

### Étape 1 : Créer une Application Meta

1. Allez sur **https://developers.facebook.com**
2. Cliquez sur **"Mes apps"** → **"Créer une app"**
3. Choisissez **"Consumer"** ou **"Business"**
4. Remplissez les informations :
   - Nom de l'app : `DM Manager` (ou votre choix)
   - Email de contact
5. Cliquez sur **"Créer l'app"**

---

### Étape 2 : Ajouter les Produits

#### Facebook Login

1. Dans le tableau de bord, cliquez sur **"Ajouter un produit"**
2. Sélectionnez **"Facebook Login"** → **"Configurer"**
3. Allez dans **"Facebook Login"** → **"Paramètres"**

**Configuration requise :**

✅ **Web OAuth Login** : Activé  
✅ **Client OAuth Login** : Activé  
✅ **Strict Mode** : Activé (recommandé)

**Valid OAuth Redirect URIs** (IMPORTANT) :

Pour le **développement local** :
```
http://localhost:4000/auth/meta/callback
```

Pour la **production** (Heroku) :
```
https://votre-app-name.herokuapp.com/auth/meta/callback
```

⚠️ **ATTENTION** : L'URL doit être EXACTE (respecter la casse, le protocole http/https)

#### Instagram

1. Dans le tableau de bord, cliquez sur **"Ajouter un produit"**
2. Sélectionnez **"Instagram"** → **"Configurer"**
3. Suivez les instructions pour configurer Instagram Graph API

---

### Étape 3 : Configuration de Base

Allez dans **"Paramètres"** → **"Paramètres de base"**

**App Domains** :
```
Development : localhost
Production  : votre-app-name.herokuapp.com
```

Notez ces valeurs (vous en aurez besoin) :
- ✅ **App ID** (ID de l'application)
- ✅ **App Secret** (Clé secrète de l'application)

---

### Étape 4 : Permissions Instagram

Allez dans **"Autorisations et fonctionnalités de l'app"**

Demandez l'accès à :
- ✅ `instagram_basic`
- ✅ `instagram_manage_messages`
- ✅ `pages_messaging`
- ✅ `pages_show_list`

---

### Étape 5 : Configuration dans votre Application

Mettez à jour le fichier `/backend/.env` :

```bash
# Instagram Graph API
INSTAGRAM_APP_ID="votre-app-id-ici"
INSTAGRAM_APP_SECRET="votre-app-secret-ici"

# Développement local
INSTAGRAM_REDIRECT_URI="http://localhost:4000/auth/meta/callback"

# Production Heroku (quand vous déployez)
# INSTAGRAM_REDIRECT_URI="https://votre-app-name.herokuapp.com/auth/meta/callback"
```

---

## 📞 Configuration WhatsApp Business API

### Étape 1 : Prérequis

Vous devez avoir :
- Un compte Meta Business
- Un numéro de téléphone dédié (qui n'est pas déjà utilisé sur WhatsApp)
- Une Page Facebook vérifiée

### Étape 2 : Configurer WhatsApp dans Meta Business

1. Allez sur **https://business.facebook.com**
2. Sélectionnez votre entreprise ou créez-en une
3. Allez dans **"Paramètres de l'entreprise"** → **"WhatsApp Business"**
4. Cliquez sur **"Ajouter un compte WhatsApp"**

### Étape 3 : Obtenir les Credentials

Une fois configuré, notez :
- ✅ **Business Account ID**
- ✅ **Phone Number ID**
- ✅ **Access Token** (permanente)

### Étape 4 : Configuration dans votre Application

Mettez à jour le fichier `/backend/.env` :

```bash
# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID="votre-business-account-id"
WHATSAPP_ACCESS_TOKEN="votre-permanent-access-token"
WHATSAPP_PHONE_NUMBER_ID="votre-phone-number-id"
WHATSAPP_VERIFY_TOKEN="un-token-secret-de-votre-choix"
```

---

## 🔔 Configuration des Webhooks

### Instagram Webhooks

1. Dans votre App Meta, allez dans **"Instagram"** → **"Configuration"**
2. Section **"Webhooks"** :

**Callback URL** :
```
Développement : http://votre-ngrok-url.ngrok.io/api/webhooks/instagram
Production   : https://votre-app-name.herokuapp.com/api/webhooks/instagram
```

**Verify Token** : (celui dans votre `.env`)
```
my_verify_token
```

**Champs à souscrire** :
- ✅ `messages`
- ✅ `messaging_postbacks`

### WhatsApp Webhooks

1. Dans Meta Business, configuration WhatsApp
2. Section **"Configuration des webhooks"** :

**Callback URL** :
```
Développement : http://votre-ngrok-url.ngrok.io/api/webhooks/whatsapp
Production   : https://votre-app-name.herokuapp.com/api/webhooks/whatsapp
```

**Verify Token** : (le même que Instagram)
```
my_verify_token
```

**Champs à souscrire** :
- ✅ `messages`

---

## 🧪 Tester en Local avec ngrok

Pour tester les webhooks en développement local :

### 1. Installer ngrok

```bash
brew install ngrok
```

### 2. Exposer votre serveur local

```bash
ngrok http 4000
```

### 3. Utiliser l'URL ngrok

ngrok vous donnera une URL comme : `https://abc123.ngrok.io`

Utilisez cette URL pour :
- Webhooks Instagram : `https://abc123.ngrok.io/api/webhooks/instagram`
- Webhooks WhatsApp : `https://abc123.ngrok.io/api/webhooks/whatsapp`

---

## ✅ Checklist de Configuration

### Instagram
- [ ] App Meta créée
- [ ] Facebook Login configuré
- [ ] Valid OAuth Redirect URIs ajoutées
- [ ] Instagram produit ajouté
- [ ] App ID et App Secret copiés dans .env
- [ ] Permissions demandées
- [ ] Webhooks configurés (optionnel pour MVP)

### WhatsApp
- [ ] Compte WhatsApp Business créé
- [ ] Numéro vérifié
- [ ] Business Account ID noté
- [ ] Phone Number ID noté
- [ ] Access Token permanent généré
- [ ] Credentials copiés dans .env
- [ ] Webhooks configurés (optionnel pour MVP)

---

## 🔐 URLs de Redirection Complètes

Configurez ces URLs **EXACTEMENT** dans Meta Dashboard :

### Développement Local
```
http://localhost:4000/auth/meta/callback
```

### Production Heroku
```
https://votre-app-name.herokuapp.com/auth/meta/callback
```

### Avec ngrok (tests webhooks)
```
https://votre-id-ngrok.ngrok.io/auth/meta/callback
```

⚠️ **IMPORTANT** : Ces URLs doivent être configurées dans :
- Meta Dashboard → Facebook Login → Settings → Valid OAuth Redirect URIs

---

## 🚀 Après Configuration

Une fois tout configuré :

1. **Redémarrez le backend** pour charger les nouvelles variables
2. **Testez la connexion Instagram** depuis votre app
3. **Vérifiez dans Prisma Studio** que le compte est bien créé
4. **Testez l'envoi de DM** via votre compte connecté

---

## 📝 Variables d'Environnement Complètes

Votre fichier `/backend/.env` devrait ressembler à :

```env
# Database
DATABASE_URL="postgresql://ato@localhost:5432/dm_manager?schema=public"

# JWT
JWT_SECRET="votre-secret-fort-production"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-votre-vraie-clé-openai"

# Instagram Graph API
INSTAGRAM_APP_ID="123456789012345"
INSTAGRAM_APP_SECRET="votre-app-secret"
INSTAGRAM_REDIRECT_URI="http://localhost:4000/auth/meta/callback"

# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
WHATSAPP_ACCESS_TOKEN="EAAG..."
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_VERIFY_TOKEN="mon-token-secret-unique"

# Google OAuth
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/auth/google/callback"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Server
PORT=4000
NODE_ENV="development"
```

---

## 🆘 Dépannage

### Erreur : "redirect_uri_mismatch"
→ Vérifiez que l'URL est EXACTEMENT la même dans Meta Dashboard et dans votre .env

### Erreur : "App not setup"
→ Vérifiez que tous les produits sont activés et configurés

### Erreur : "Invalid scope"
→ Vérifiez que vous avez demandé les bonnes permissions

### Callback ne fonctionne pas
→ Vérifiez les logs backend pour voir l'erreur exacte

---

## 📚 Ressources Utiles

- [Meta for Developers](https://developers.facebook.com)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api/)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/)
- [Facebook Login Configuration](https://developers.facebook.com/docs/facebook-login/web)

---

**Une fois configuré, votre application pourra se connecter à Instagram et WhatsApp ! 🎉**


