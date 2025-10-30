# 🧭 Configuration Complète Facebook Login - SetYourCommunity

## ✅ Routes Implémentées dans l'Application

Votre application expose maintenant **3 routes publiques** pour Facebook/Meta :

1. **OAuth Callback** : `/auth/meta/callback`
2. **Deauthorization Callback** : `/auth/meta/deauthorize`
3. **Data Deletion Callback** : `/privacy/delete`

---

## 📋 Configuration Meta Dashboard - Étapes Détaillées

### 1️⃣ Validateur d'URI de Redirection

**Localisation** : Meta Dashboard → Facebook Login → Settings

**Action** :
1. Collez votre URL de callback : `https://app.setyourcommunity.fun/auth/meta/callback`
2. Cliquez sur **"Vérifier l'URI"**
3. Le validateur doit répondre **OK** ✅

**URLs à tester** :
```
https://app.setyourcommunity.fun/auth/meta/callback
http://localhost:4000/auth/meta/callback (dev local)
```

---

### 2️⃣ Paramètres OAuth Client

**Localisation** : Meta Dashboard → Facebook Login → Settings → **Paramètres OAuth client**

#### ✅ À Activer (Recommandé)

| Option | État | Raison |
|--------|------|--------|
| **Connexion OAuth cliente** | ✅ Activé | Flow OAuth standard (nécessaire) |
| **Connexion OAuth Web** | ✅ Activé | Vous utilisez un site web |
| **Imposer le HTTPS** | ✅ Activé | Sécurité + exigence review |
| **Utiliser le mode strict pour les URI de redirection** | ✅ Activé | Empêche détournements |

#### ❌ À Désactiver (Par défaut)

| Option | État | Raison |
|--------|------|--------|
| **Forcer la ré-authentification OAuth Web** | ❌ Désactivé | UX plus fluide (sauf cas sensible) |
| **Connexion OAuth de navigateur intégrée** | ❌ Désactivé | Pas nécessaire pour web desktop/mobile |
| **Device Login** | ❌ Désactivé | Utile pour TV/IoT uniquement |

---

### 3️⃣ URI de Redirection OAuth Valides

**Localisation** : Meta Dashboard → Facebook Login → Settings → **URI de redirection OAuth valides**

⚠️ **LE CHAMP LE PLUS IMPORTANT**

**Ajoutez une URL par ligne** :

#### Production :
```
https://app.setyourcommunity.fun/auth/meta/callback
https://setyourcommunity.fun/auth/meta/callback
```

#### Développement Local (si tests) :
```
http://localhost:4000/auth/meta/callback
```

**⚠️ ATTENTION** :
- Ne mettez pas de slash final `/` si votre code ne l'utilise pas
- En mode strict, la moindre différence casse l'auth
- Respectez la casse exacte
- Respectez le protocole (http vs https)

---

### 4️⃣ Connexion à partir des Appareils (Device Login)

**État** : ❌ **Désactivé**

**Raison** : Utile pour TV/IoT, pas nécessaire pour un SaaS web

---

### 5️⃣ Se Connecter avec le SDK JavaScript

**État** : **Activé UNIQUEMENT si vous utilisez le SDK JS Facebook**

**Si oui, remplissez** "Domaines autorisés pour le SDK Javascript" :
```
setyourcommunity.fun
app.setyourcommunity.fun
localhost
```

**Si vous faites l'OAuth en full redirect server-side** (notre cas actuel), vous pouvez laisser **désactivé**.

---

### 6️⃣ Annuler l'Autorisation (Deauthorization Callback)

**État** : ✅ **OBLIGATOIRE** pour la conformité

**Localisation** : Meta Dashboard → Facebook Login → Settings → **Annuler l'autorisation**

**URL de rappel pour les annulations d'autorisation** :
```
https://app.setyourcommunity.fun/auth/meta/deauthorize
```

**Ce qui est implémenté côté backend** :
- ✅ Validation du `signed_request` envoyé par Meta
- ✅ Marquage de la connexion comme révoquée (désactive tokens)
- ✅ Logging de l'événement
- ✅ Désactivation automatique des comptes Instagram liés

**Format attendu** :
- Facebook envoie un POST avec `signed_request` dans le body (form-encoded)
- Votre backend valide la signature HMAC-SHA256
- Les comptes Instagram sont automatiquement désactivés

---

### 7️⃣ Demandes de Suppression de Données (Data Deletion Callback)

**État** : ✅ **OBLIGATOIRE** pour RGPD et Review

**Localisation** : Meta Dashboard → Facebook Login → Settings → **Demandes de suppression de données**

**URL de la demande de suppression des données** :
```
https://app.setyourcommunity.fun/privacy/delete
```

**Ce qui est implémenté côté backend** :
- ✅ Réception d'un identifiant utilisateur (app-scoped `user_id`)
- ✅ Effacement/sanitation des données liées
- ✅ Suppression des comptes, conversations, messages, knowledge base
- ✅ Réponse JSON avec `status` et `timestamp`
- ✅ URL de statut pour suivre l'état de la suppression

**Format attendu par Facebook** :
```json
{
  "url": "https://app.setyourcommunity.fun/privacy/deletion-status",
  "confirmation_code": "DEL_...",
  "status": "completed",
  "timestamp": "2025-10-28T..."
}
```

---

## 📝 Checklist Configuration Complète

### ✅ Facebook Login Settings

- [ ] **Connexion OAuth cliente** : Activé
- [ ] **Connexion OAuth Web** : Activé
- [ ] **Imposer le HTTPS** : Activé
- [ ] **Mode strict URI** : Activé
- [ ] **Forcer ré-auth Web** : Désactivé
- [ ] **Connexion OAuth webview** : Désactivé
- [ ] **Device Login** : Désactivé
- [ ] **SDK JS** : Activé uniquement si utilisé

### ✅ URIs de Redirection OAuth Valides

- [ ] `https://app.setyourcommunity.fun/auth/meta/callback`
- [ ] `https://setyourcommunity.fun/auth/meta/callback`
- [ ] `http://localhost:4000/auth/meta/callback` (dev)

### ✅ Callbacks Obligatoires

- [ ] **Deauthorization URL** : `https://app.setyourcommunity.fun/auth/meta/deauthorize`
- [ ] **Data Deletion URL** : `https://app.setyourcommunity.fun/privacy/delete`

### ✅ App Domains (Settings → Basic)

- [ ] Production : `app.setyourcommunity.fun`
- [ ] Production : `setyourcommunity.fun`
- [ ] Dev : `localhost`

### ✅ SDK JavaScript Domains (si activé)

- [ ] `setyourcommunity.fun`
- [ ] `app.setyourcommunity.fun`
- [ ] `localhost`

---

## 🔒 Sécurité - Points Clés

### Validation du Paramètre `state` (CSRF)

✅ **Déjà implémenté** :
- Le `state` contient l'userId encodé en base64
- Validation côté serveur avant échange code → token
- Protection contre les attaques CSRF

### Validation du `signed_request` (Deauthorization)

✅ **Déjà implémenté** :
- Validation HMAC-SHA256 avec l'App Secret
- Vérification de l'App ID
- Comparaison constante (timing-safe) pour éviter les timing attacks

### Chiffrement des Tokens

⚠️ **À Implémenter en production** :
- Les tokens doivent être chiffrés au repos
- Utilisez KMS (Key Vault / AWS Secrets Manager) ou des libs standards
- Ne jamais logger les tokens complets

### Logging des Erreurs OAuth

✅ **Déjà implémenté** :
- Tous les `error` et `error_description` OAuth sont loggés
- Facilite le debugging

### CORS

✅ **Déjà configuré** :
- CORS activé avec origine `FRONTEND_URL`
- Credentials autorisés

---

## 🧪 Tester la Configuration

### 1. Tester l'OAuth Callback

```bash
# Backend doit être running sur port 4000
curl http://localhost:4000/auth/meta/callback?code=TEST&state=TEST
# Devrait rediriger vers le frontend avec une erreur (normal, code invalide)
```

### 2. Tester le Deauthorization Callback

```bash
# Générer un signed_request de test (requiert l'App Secret)
curl -X POST http://localhost:4000/auth/meta/deauthorize \
  -d "signed_request=VALID_SIGNED_REQUEST"
```

### 3. Tester le Data Deletion Callback

```bash
curl -X POST http://localhost:4000/privacy/delete \
  -d "user_id=TEST_USER_ID"
# Devrait retourner un JSON avec confirmation_code et url
```

---

## 📚 URLs Complètes pour Production

### OAuth Callback
```
https://app.setyourcommunity.fun/auth/meta/callback
```

### Deauthorization
```
https://app.setyourcommunity.fun/auth/meta/deauthorize
```

### Data Deletion
```
https://app.setyourcommunity.fun/privacy/delete
```

### Frontend URLs (pour redirections)
```
https://app.setyourcommunity.fun/dashboard
https://app.setyourcommunity.fun/privacy/deletion-status
```

---

## 🚀 Après Configuration

1. **Vérifiez toutes les URLs** avec le validateur Meta
2. **Sauvegardez les modifications** dans Meta Dashboard
3. **Testez en local** avec ngrok si nécessaire
4. **Déployez en production** (Heroku)
5. **Testez le flow complet** : Connexion → Messages → Déconnexion

---

## ⚠️ Erreurs Communes

### "redirect_uri_mismatch"
→ Vérifiez que l'URL est EXACTEMENT la même dans Meta Dashboard et dans votre `.env`

### "Invalid signed_request"
→ Vérifiez que `INSTAGRAM_APP_SECRET` est correct dans votre `.env`

### "Missing user_id"
→ Vérifiez que le compte Instagram est bien lié à un compte Facebook

---

**Une fois tout configuré, votre application respectera toutes les exigences Facebook/Meta pour la review ! 🎉**

