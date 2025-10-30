# Guide de Démarrage Rapide

## Configuration initiale (5 minutes)

### 1. Installation des dépendances

```bash
# Installer les dépendances du backend
cd backend
npm install

# Installer les dépendances du frontend
cd ../frontend
npm install
```

### 2. Configuration de la base de données

Créez une base de données PostgreSQL locale:

```bash
# Avec Docker (recommandé)
docker run --name dm-manager-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dm_manager -p 5432:5432 -d postgres

# Ou installez PostgreSQL directement sur votre machine
```

### 3. Variables d'environnement

Copiez `.env.example` vers `.env` dans le dossier `backend`:

```bash
cd backend
cp .env.example .env
```

**Modifiez le fichier `.env` avec vos vraies valeurs:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dm_manager"
JWT_SECRET="changez-moi-en-production"
OPENAI_API_KEY="sk-votre-clé-openai"
```

**Note:** Pour tester localement, vous pouvez laisser les valeurs Instagram/WhatsApp vides pour l'instant.

### 4. Migration de la base de données

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Accéder à l'application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio (visualiser la DB): `cd backend && npx prisma studio`

## Premiers pas

1. **Créer un compte**: Ouvrez http://localhost:5173/register
2. **Se connecter**: Utilisez vos identifiants
3. **Ajouter un compte** (optionnel pour tester l'UI):
   - Pour l'instant, vous pouvez explorer l'interface sans connecter de vrais comptes
   - Pour connecter Instagram/WhatsApp, vous aurez besoin de configurer les APIs Meta

## Configuration des APIs Meta (optionnel)

### Instagram Business API

1. Aller sur https://developers.facebook.com
2. Créer une application
3. Ajouter le produit "Instagram"
4. Configurer OAuth et les permissions
5. Copier `App ID` et `App Secret` dans `.env`

### WhatsApp Business API

1. Aller sur https://business.facebook.com
2. Configurer WhatsApp Business API
3. Obtenir `Phone Number ID` et `Access Token`
4. Copier dans `.env`

### Configuration des Webhooks

Une fois déployé sur Heroku:
- URL Instagram: `https://votre-app.herokuapp.com/api/webhooks/instagram`
- URL WhatsApp: `https://votre-app.herokuapp.com/api/webhooks/whatsapp`
- Verify Token: celui défini dans `WHATSAPP_VERIFY_TOKEN`

## Tests sans APIs Meta

Pour tester l'application sans connecter de vrais comptes Instagram/WhatsApp:

1. Utilisez Prisma Studio pour ajouter manuellement des données de test
2. Explorez l'interface et testez les fonctionnalités du bot
3. Configurez le LLM avec OpenAI (requis pour les réponses automatiques)

## Déploiement sur Heroku

```bash
# Login Heroku
heroku login

# Créer l'app
heroku create votre-app-name

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurer les variables
heroku config:set JWT_SECRET="votre-secret"
heroku config:set OPENAI_API_KEY="sk-votre-clé"
# ... etc

# Déployer
git add .
git commit -m "Initial commit"
git push heroku main

# Migrer la DB
heroku run npx prisma migrate deploy
```

## Dépannage

### Le backend ne démarre pas
- Vérifiez que PostgreSQL est bien lancé
- Vérifiez que `DATABASE_URL` est correct
- Assurez-vous d'avoir exécuté `npx prisma migrate dev`

### Erreurs TypeScript
- Exécutez `npx prisma generate` dans le backend
- Redémarrez votre éditeur de code

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 5000
- Vérifiez le fichier `vite.config.ts` (proxy configuration)

## Support

Pour toute question, consultez le README.md principal ou ouvrez une issue sur GitHub.


