# 🔐 Configuration OAuth Callback - Instagram

## ✅ URLs de Callback Configurées

### Backend Routes

Votre application utilise maintenant la route :
```
/auth/meta/callback
```

### URLs Complètes

**Développement local (port 4000)** :
```
http://localhost:4000/auth/meta/callback
```

**Production Heroku** :
```
https://votre-app-name.herokuapp.com/auth/meta/callback
```

---

## 📋 Configuration Meta Dashboard

### Facebook Login → Settings

Allez dans votre App Meta : **https://developers.facebook.com**

1. Sélectionnez votre app
2. **Produits** → **Facebook Login** → **Paramètres**
3. Activez ces options :
   - ✅ **Web OAuth Login** : ON
   - ✅ **Client OAuth Login** : ON
   - ✅ **Strict Mode** : ON (recommandé)

4. **Valid OAuth Redirect URIs** - Ajoutez :

Pour le développement :
```
http://localhost:4000/auth/meta/callback
```

Pour la production :
```
https://votre-app-name.herokuapp.com/auth/meta/callback
```

⚠️ **IMPORTANT** : 
- Une URL par ligne
- Respecter EXACTEMENT le protocole (http vs https)
- Respecter le port (4000)
- Pas d'espace avant/après
- Pas de slash final `/`

5. Cliquez sur **"Enregistrer les modifications"**

---

### Settings → Basic

1. **App Domains** : Ajoutez
   - Development : `localhost`
   - Production : `votre-app-name.herokuapp.com`

2. **App ID** et **App Secret** :
   - Copiez l'App ID
   - Cliquez sur "Afficher" pour voir l'App Secret
   - Mettez-les dans votre fichier `.env`

---

## 🔄 Flux OAuth Complet

### 1. Utilisateur clique sur "Connecter Instagram"

Le frontend appelle :
```
GET /api/accounts/connect/instagram
```

Le backend répond avec :
```json
{
  "authUrl": "https://www.facebook.com/v18.0/dialog/oauth?client_id=...&redirect_uri=http://localhost:4000/auth/meta/callback&state=..."
}
```

### 2. Redirection vers Facebook

L'utilisateur est redirigé vers Facebook pour autoriser l'app

### 3. Facebook redirige vers votre callback

Après autorisation, Facebook redirige vers :
```
http://localhost:4000/auth/meta/callback?code=ABC123&state=XYZ789
```

### 4. Votre backend traite le callback

- Échange le code contre un access token
- Récupère les infos du compte Instagram
- Sauvegarde dans la base de données
- Crée une configuration bot par défaut
- Redirige vers le dashboard

### 5. Utilisateur retourne sur le frontend

Redirigé vers :
```
http://localhost:5173/dashboard?success=instagram_connected
```

---

## 🔒 Sécurité avec State Parameter

Le **state** contient :
- L'ID de l'utilisateur (encodé en base64)
- Un timestamp

Cela permet de :
- Vérifier que c'est bien le bon utilisateur
- Prévenir les attaques CSRF
- Associer le compte Instagram au bon utilisateur

---

## 🧪 Tester la Configuration

### 1. Vérifier que les variables sont chargées

```bash
cd /Users/ato/Documents/SetYourcommunity/backend
cat .env | grep INSTAGRAM
```

Vous devriez voir :
```
INSTAGRAM_APP_ID="..."
INSTAGRAM_APP_SECRET="..."
INSTAGRAM_REDIRECT_URI="http://localhost:4000/auth/meta/callback"
```

### 2. Redémarrer le backend

```bash
# Arrêter
lsof -ti:4000 | xargs kill

# Relancer
cd /Users/ato/Documents/SetYourcommunity/backend
npm run dev
```

### 3. Tester l'URL de callback

Vérifiez que la route existe :
```bash
curl http://localhost:4000/auth/meta/callback
# Devrait retourner une redirection (302)
```

---

## 📱 Dans Meta Dashboard - Étapes Exactes

### Valid OAuth Redirect URIs

1. Allez sur https://developers.facebook.com
2. **Mes apps** → Sélectionnez votre app
3. Menu latéral : **Produits** → **Facebook Login** → **Paramètres**
4. Trouvez **"Valid OAuth Redirect URIs"**
5. Ajoutez cette URL (cliquez sur le + pour ajouter) :
   ```
   http://localhost:4000/auth/meta/callback
   ```
6. **Enregistrer les modifications**

### App Domains

1. Menu latéral : **Paramètres** → **Paramètres de base**
2. Trouvez **"App Domains"**
3. Ajoutez :
   ```
   localhost
   ```
4. **Enregistrer les modifications**

---

## 🎯 Variables d'Environnement à Configurer

Dans `/backend/.env` :

```bash
INSTAGRAM_APP_ID="REMPLACEZ_PAR_VOTRE_APP_ID"
INSTAGRAM_APP_SECRET="REMPLACEZ_PAR_VOTRE_APP_SECRET"
INSTAGRAM_REDIRECT_URI="http://localhost:4000/auth/meta/callback"
```

Une fois fait :
1. Redémarrez le backend
2. Testez la connexion Instagram depuis l'app
3. Le popup de prérequis s'affichera
4. Cliquez sur "Je confirme, continuer"
5. Vous serez redirigé vers Facebook pour autoriser
6. Après autorisation, retour sur votre dashboard

---

## ✨ Nouveau Flux Implémenté

1. **Clic "Instagram Business"** → **Popup de prérequis** ✅
2. **"Je confirme, continuer"** → Redirection Facebook OAuth
3. **Autorisation Facebook** → Retour sur `/auth/meta/callback`
4. **Backend traite le callback** → Sauvegarde compte + token
5. **Redirection dashboard** → `?success=instagram_connected`

---

**Suivez le guide `META_SETUP_GUIDE.md` pour configurer votre App Meta ! 🚀**


