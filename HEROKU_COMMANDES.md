# 📋 Commandes Heroku - Guide Rapide

## ✅ Configuration Actuelle

- **App** : `setyourcommunity`
- **URL** : https://setyourcommunity.herokuapp.com
- **Region** : EU
- **PostgreSQL** : `essential-0` (création en cours)

---

## 🚀 Déploiement

### Déployer le Code

```bash
# Depuis le dossier du projet
cd /Users/ato/Documents/SetYourcommunity

# Pousser vers Heroku (déclenche le build et déploiement)
git push heroku main
```

### Suivre les Logs en Temps Réel

```bash
# Logs en temps réel (voir tout ce qui se passe)
heroku logs --tail -a setyourcommunity

# Logs des dernières 100 lignes
heroku logs -n 100 -a setyourcommunity

# Logs filtrés (ex: seulement les erreurs)
heroku logs --tail -a setyourcommunity | grep -i error
```

---

## 📊 Monitoring & Logs

### Voir les Logs de Déploiement

```bash
# Logs complets en temps réel
heroku logs --tail -a setyourcommunity

# Logs des derniers déploiements
heroku releases -a setyourcommunity

# Info sur une release spécifique
heroku releases:info v12 -a setyourcommunity
```

### Voir l'État de l'App

```bash
# Info complète de l'app
heroku apps:info -a setyourcommunity

# Status des dynos (processus)
heroku ps -a setyourcommunity

# Métriques (CPU, mémoire)
heroku ps:monitor -a setyourcommunity
```

---

## ⚙️ Configuration

### Variables d'Environnement

```bash
# Voir toutes les variables
heroku config -a setyourcommunity

# Ajouter une variable
heroku config:set NOM_VARIABLE="valeur" -a setyourcommunity

# Ajouter plusieurs variables
heroku config:set JWT_SECRET="secret" OPENAI_API_KEY="sk-..." -a setyourcommunity

# Supprimer une variable
heroku config:unset NOM_VARIABLE -a setyourcommunity
```

### Base de Données

```bash
# Voir les infos de la base
heroku pg:info -a setyourcommunity

# Connexion à la base (psql)
heroku pg:psql -a setyourcommunity

# Exécuter les migrations Prisma
heroku run npx prisma migrate deploy -a setyourcommunity

# Générer Prisma Client
heroku run npx prisma generate -a setyourcommunity
```

---

## 🔧 Maintenance

### Redémarrer l'App

```bash
# Redémarrer tous les dynos
heroku restart -a setyourcommunity

# Redémarrer un dyno spécifique
heroku restart web.1 -a setyourcommunity
```

### Exécuter des Commandes

```bash
# Console interactive (bash)
heroku run bash -a setyourcommunity

# Exécuter une commande spécifique
heroku run npm run prisma:studio -a setyourcommunity
heroku run npx prisma migrate deploy -a setyourcommunity
```

---

## 📦 Addons & Ressources

### Voir les Addons

```bash
# Lister les addons
heroku addons -a setyourcommunity

# Info sur un addon spécifique
heroku addons:info postgresql-lively-18392 -a setyourcommunity

# Docs d'un addon
heroku addons:docs heroku-postgresql
```

### Scaling (si besoin)

```bash
# Voir les dynos actuels
heroku ps -a setyourcommunity

# Scale up/down
heroku ps:scale web=1 -a setyourcommunity
```

---

## 🐛 Dépannage

### App Crashée

```bash
# Voir les logs d'erreur
heroku logs --tail -a setyourcommunity

# Voir les dernières erreurs
heroku logs -n 500 -a setyourcommunity | grep -i error

# Redémarrer
heroku restart -a setyourcommunity
```

### Build Failed

```bash
# Voir les logs de build
heroku builds:info -a setyourcommunity

# Voir les dernières builds
heroku builds -a setyourcommunity

# Annuler une build en cours
heroku builds:cancel -a setyourcommunity
```

### Base de Données

```bash
# Voir le statut de la DB
heroku pg:info -a setyourcommunity

# Voir les connexions actives
heroku pg:connections -a setyourcommunity

# Backup de la DB (si plan payant)
heroku pg:backups:capture -a setyourcommunity
heroku pg:backups -a setyourcommunity
```

---

## 🎯 Commandes Rapides pour Déploiement

### Workflow Complet

```bash
# 1. Voir les logs en temps réel dans un terminal
heroku logs --tail -a setyourcommunity

# 2. Dans un autre terminal, déployer
cd /Users/ato/Documents/SetYourcommunity
git push heroku main

# Les logs s'afficheront en temps réel dans le premier terminal !
```

### Script de Déploiement Complet

```bash
#!/bin/bash
# Déployer avec logs automatiques

cd /Users/ato/Documents/SetYourcommunity

echo "🚀 Déploiement sur Heroku..."
git push heroku main

echo "📊 Logs (Ctrl+C pour arrêter) :"
heroku logs --tail -a setyourcommunity
```

Sauvegardez dans `deploy.sh`, puis :
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 Checklist Déploiement

### Avant le Déploiement

```bash
# Vérifier que tout est committé
git status

# Vérifier les remotes
git remote -v
```

### Pendant le Déploiement

```bash
# Terminal 1 : Suivre les logs
heroku logs --tail -a setyourcommunity

# Terminal 2 : Déployer
git push heroku main
```

### Après le Déploiement

```bash
# Vérifier que l'app tourne
heroku ps -a setyourcommunity

# Tester l'endpoint health
curl https://setyourcommunity.herokuapp.com/health

# Vérifier les logs pour erreurs
heroku logs -n 100 -a setyourcommunity
```

---

## 🔗 URLs Importantes

- **App** : https://setyourcommunity.herokuapp.com
- **Dashboard** : https://dashboard.heroku.com/apps/setyourcommunity
- **Health Check** : https://setyourcommunity.herokuapp.com/health
- **Logs Dashboard** : https://dashboard.heroku.com/apps/setyourcommunity/logs

---

## 💡 Astuces

### Alias Utiles (Optionnel)

Ajoutez dans votre `~/.zshrc` ou `~/.bashrc` :

```bash
alias heroku-logs='heroku logs --tail -a setyourcommunity'
alias heroku-config='heroku config -a setyourcommunity'
alias heroku-deploy='git push heroku main'
```

Puis :
```bash
source ~/.zshrc
# Utiliser : heroku-logs, heroku-config, heroku-deploy
```

---

**Maintenant vous pouvez déployer et suivre les logs en temps réel ! 🎉**

