# Commandes Utiles

## Développement Local

### Backend

```bash
# Installer les dépendances
cd backend
npm install

# Générer le client Prisma
npx prisma generate

# Créer et appliquer une migration
npx prisma migrate dev --name init

# Lancer le serveur en mode dev
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start

# Ouvrir Prisma Studio (interface DB)
npx prisma studio
```

### Frontend

```bash
# Installer les dépendances
cd frontend
npm install

# Lancer en mode dev
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## Base de Données

### Prisma Commands

```bash
# Générer le client Prisma après modification du schema
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Reset la base de données (ATTENTION: efface toutes les données)
npx prisma migrate reset

# Ouvrir Prisma Studio
npx prisma studio

# Seed la base de données (si vous créez un seed)
npx prisma db seed
```

### PostgreSQL avec Docker

```bash
# Démarrer PostgreSQL
docker run --name dm-manager-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=dm_manager \
  -p 5432:5432 \
  -d postgres

# Arrêter le container
docker stop dm-manager-db

# Démarrer un container existant
docker start dm-manager-db

# Voir les logs
docker logs dm-manager-db

# Supprimer le container
docker rm dm-manager-db
```

## Git

```bash
# Initialiser le repo
git init
git add .
git commit -m "Initial commit - MVP DM Manager"

# Créer un nouveau repo sur GitHub et le lier
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

## Heroku

### Configuration initiale

```bash
# Login Heroku
heroku login

# Créer une nouvelle app
heroku create your-app-name

# Ou lier à une app existante
heroku git:remote -a your-app-name

# Ajouter PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Voir la DATABASE_URL
heroku config:get DATABASE_URL
```

### Variables d'environnement

```bash
# Définir une variable
heroku config:set JWT_SECRET="your-secret-key"

# Définir plusieurs variables
heroku config:set \
  OPENAI_API_KEY="sk-your-key" \
  INSTAGRAM_APP_ID="your-id" \
  INSTAGRAM_APP_SECRET="your-secret"

# Voir toutes les variables
heroku config

# Supprimer une variable
heroku config:unset VARIABLE_NAME
```

### Déploiement

```bash
# Déployer sur Heroku
git push heroku main

# Forcer le déploiement
git push heroku main --force

# Voir les logs en temps réel
heroku logs --tail

# Voir les derniers logs
heroku logs --num=100

# Exécuter les migrations
heroku run npx prisma migrate deploy

# Ouvrir l'app dans le navigateur
heroku open

# Redémarrer l'app
heroku restart

# Exécuter une commande sur Heroku
heroku run bash
heroku run npx prisma studio
```

### Debugging

```bash
# Voir les logs d'erreurs
heroku logs --tail --source app

# Voir les informations de l'app
heroku info

# Voir les dyno processes
heroku ps

# Scaler les dynos
heroku ps:scale web=1

# Exécuter des commandes Node
heroku run node
```

## Tests et Qualité du Code

### Linting (si vous ajoutez ESLint)

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
npm run lint -- --fix
```

### TypeScript

```bash
# Vérifier les types sans build
cd backend
npx tsc --noEmit

cd frontend
npx tsc --noEmit
```

## Maintenance

### Mise à jour des dépendances

```bash
# Voir les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances (attention!)
npm update

# Mettre à jour une dépendance spécifique
npm install package-name@latest
```

### Nettoyage

```bash
# Supprimer node_modules et reinstaller
rm -rf node_modules
npm install

# Nettoyer le cache npm
npm cache clean --force

# Backend: supprimer le build
cd backend
rm -rf dist
npm run build
```

## Backup et Restore (Heroku PostgreSQL)

```bash
# Créer un backup
heroku pg:backups:capture

# Lister les backups
heroku pg:backups

# Télécharger le dernier backup
heroku pg:backups:download

# Restore depuis un backup
heroku pg:backups:restore b001 DATABASE_URL
```

## Webhooks Testing

### Utiliser ngrok pour tester les webhooks localement

```bash
# Installer ngrok
brew install ngrok  # macOS
# ou télécharger depuis https://ngrok.com

# Exposer le port 5000
ngrok http 5000

# Utiliser l'URL ngrok comme webhook URL
# Ex: https://abc123.ngrok.io/api/webhooks/instagram
```

## Monitoring

```bash
# Voir les métriques de l'app
heroku metrics

# Voir l'utilisation de la base de données
heroku pg:info

# Voir les connexions actives
heroku pg:ps
```

## Commandes Rapides

### Démarrage rapide en dev

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3 (optionnel)
cd backend && npx prisma studio
```

### Build et test avant déploiement

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Mise en production complète

```bash
# 1. Commit les changements
git add .
git commit -m "Update: description"

# 2. Push vers GitHub
git push origin main

# 3. Deploy sur Heroku
git push heroku main

# 4. Migrer la DB si nécessaire
heroku run npx prisma migrate deploy

# 5. Vérifier les logs
heroku logs --tail

# 6. Tester l'app
heroku open
```

## Troubleshooting

### Backend ne démarre pas

```bash
# Vérifier la DB
docker ps  # PostgreSQL doit être running
npx prisma generate
npx prisma migrate dev

# Vérifier les variables d'env
cat backend/.env
```

### Build échoue sur Heroku

```bash
# Vérifier les logs
heroku logs --tail

# Vérifier les dépendances
heroku run npm list

# Forcer un rebuild
heroku repo:purge_cache -a your-app-name
git commit --allow-empty -m "Rebuild"
git push heroku main
```

### Erreurs de migration

```bash
# Reset la DB locale (ATTENTION: perte de données!)
cd backend
npx prisma migrate reset

# Sur Heroku, ne jamais reset! Au lieu de cela:
heroku run npx prisma migrate deploy
```


