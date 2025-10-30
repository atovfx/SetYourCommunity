# 📦 Connexion du Projet à GitHub

## ✅ Étape 1 : Git Initialisé

Votre projet est maintenant initialisé avec Git :
- ✅ Dépôt Git créé
- ✅ Branche `main` configurée
- ✅ Commit initial effectué (71 fichiers)
- ✅ `.gitignore` configuré

## 📋 Prochaines Étapes

### Option A : Créer un Nouveau Dépôt GitHub (Recommandé)

#### 1. Créer le Dépôt sur GitHub

1. Allez sur **https://github.com/new**
2. Remplissez les informations :
   - **Repository name** : `SetYourcommunity` (ou votre choix)
   - **Description** : "Service de gestion DM Instagram et WhatsApp avec LLM custom"
   - **Visibility** : Private (recommandé) ou Public
   - **⚠️ NE COCHEZ PAS** "Initialize with README" (vous avez déjà un commit)
   - Cliquez sur **"Create repository"**

#### 2. Connecter le Dépôt Local

Après la création, GitHub vous donnera des instructions. Utilisez ces commandes :

```bash
cd /Users/ato/Documents/SetYourcommunity

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/SetYourcommunity.git

# OU si vous utilisez SSH :
# git remote add origin git@github.com:VOTRE_USERNAME/SetYourcommunity.git

# Vérifier que le remote est configuré
git remote -v

# Pousser le code vers GitHub
git push -u origin main
```

**Remplacer** :
- `VOTRE_USERNAME` par votre nom d'utilisateur GitHub
- `SetYourcommunity` par le nom exact de votre dépôt

---

### Option B : Connecter à un Dépôt Existant

Si vous avez déjà créé un dépôt GitHub :

```bash
cd /Users/ato/Documents/SetYourcommunity

# Ajouter le remote
git remote add origin https://github.com/VOTRE_USERNAME/NOM_DEPOT.git

# Pull d'abord (si le dépôt a du contenu)
git pull origin main --allow-unrelated-histories

# Pousser votre code
git push -u origin main
```

---

## 🔐 Configuration GitHub Authentication

### Option 1 : Personal Access Token (HTTPS)

Si vous utilisez HTTPS, GitHub peut demander un token :

1. Allez sur **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Cliquez **"Generate new token (classic)"**
3. Nom : `SetYourcommunity`
4. Scopes : Cochez **`repo`** (accès complet aux dépôts)
5. Cliquez **"Generate token"**
6. **Copiez le token** (vous ne le reverrez plus !)

Quand Git demande votre mot de passe, utilisez le token comme mot de passe.

### Option 2 : SSH (Recommandé pour la sécurité)

#### Générer une clé SSH (si vous n'en avez pas)

```bash
# Vérifier si vous avez déjà une clé SSH
ls -la ~/.ssh

# Si pas de clé, générer une nouvelle
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Afficher la clé publique
cat ~/.ssh/id_ed25519.pub
```

#### Ajouter la clé à GitHub

1. Copiez la clé affichée ci-dessus
2. Allez sur **GitHub → Settings → SSH and GPG keys**
3. Cliquez **"New SSH key"**
4. Collez la clé et sauvegardez

#### Utiliser SSH pour le remote

```bash
# Si vous avez ajouté avec HTTPS, changez vers SSH
git remote set-url origin git@github.com:VOTRE_USERNAME/SetYourcommunity.git
```

---

## ✅ Vérification

Après avoir poussé le code :

```bash
# Vérifier le remote
git remote -v

# Devrait afficher :
# origin  https://github.com/VOTRE_USERNAME/SetYourcommunity.git (fetch)
# origin  https://github.com/VOTRE_USERNAME/SetYourcommunity.git (push)

# Vérifier que tout est synchronisé
git status
```

---

## 📝 Commandes Git Utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter des fichiers modifiés
git add .

# Faire un commit
git commit -m "Description des changements"

# Pousser vers GitHub
git push

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Revenir sur main
git checkout main

# Fusionner une branche
git merge feature/nouvelle-fonctionnalite
```

---

## 🚀 Déploiement Heroku via GitHub

Une fois connecté à GitHub, vous pouvez configurer le déploiement automatique sur Heroku :

### Sur Heroku Dashboard

1. Allez sur votre app Heroku
2. **Deploy** → **GitHub** → **Connect to GitHub**
3. Sélectionnez votre dépôt `SetYourcommunity`
4. Activez **"Automatic deploys"** (optionnel)
5. Cliquez **"Deploy Branch"** pour déployer `main`

### Via CLI

```bash
# Ajouter le remote Heroku (si pas déjà fait)
heroku git:remote -a votre-app-name

# Déployer
git push heroku main
```

---

## 🔒 Sécurité - Fichiers à NE JAMAIS Commiter

Votre `.gitignore` est configuré pour exclure :

- ✅ `.env` (variables d'environnement)
- ✅ `node_modules/` (dépendances)
- ✅ `dist/` (builds)
- ✅ `uploads/` (fichiers uploadés)
- ✅ `*.db`, `*.sqlite` (bases de données locales)

**Vérifiez toujours avant de committer** :

```bash
git status
```

Si vous voyez des fichiers `.env` ou secrets, **NE LES COMMITTEZ PAS** !

---

## 📋 Checklist Connexion GitHub

- [ ] Dépôt GitHub créé (vide, sans README)
- [ ] Remote `origin` ajouté avec la bonne URL
- [ ] Authentification configurée (SSH ou HTTPS + token)
- [ ] Code poussé avec `git push -u origin main`
- [ ] Vérifié sur GitHub.com que tous les fichiers sont présents
- [ ] `.env` **N'EST PAS** dans le dépôt (vérifier avec `git ls-files | grep .env`)

---

## ⚠️ Si Vous Voyez une Erreur

### "remote origin already exists"

```bash
# Supprimer l'ancien remote
git remote remove origin

# Ajouter le nouveau
git remote add origin https://github.com/VOTRE_USERNAME/SetYourcommunity.git
```

### "Authentication failed"

- Vérifiez votre token SSH/HTTPS
- Pour HTTPS, utilisez un Personal Access Token (pas votre mot de passe)
- Pour SSH, vérifiez que la clé est ajoutée à GitHub

### "Permission denied"

- Vérifiez que vous avez les droits sur le dépôt
- Vérifiez que l'URL du remote est correcte

---

**Une fois connecté, votre code sera sur GitHub et vous pourrez déployer sur Heroku ! 🎉**

