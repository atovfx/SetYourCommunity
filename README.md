# DM Manager - MVP

Service de gestion de DM Instagram et WhatsApp avec LLM personnalisable pour infopreneurs.

## Stack Technique

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite
- **Base de données**: PostgreSQL + Prisma ORM
- **LLM**: OpenAI (extensible)
- **Auth**: JWT + Passport.js (email/password + OAuth Google)
- **Déploiement**: Heroku

## Fonctionnalités

### 1. Authentification
- ✅ Inscription/Connexion email/password
- ✅ OAuth Google
- ✅ JWT pour sessions

### 2. Gestion des Comptes
- ✅ Connecter compte Instagram Business
- ✅ Connecter compte WhatsApp Business
- ✅ Dashboard avec liste des comptes

### 3. Configuration du Bot LLM
- ✅ Uploader documents (PDF, TXT)
- ✅ Créer FAQs manuelles
- ✅ Définir le style de réponse
- ✅ Configurer les mimics
- ✅ Choisir le modèle LLM (GPT-3.5, GPT-4)

### 4. Gestion des Conversations
- ✅ Webhooks pour messages Instagram/WhatsApp
- ✅ Réponses automatiques via LLM
- ✅ Interface de visualisation des conversations
- ✅ Prise de contrôle manuelle
- ✅ Envoi de messages manuels

### 5. Analytics & Conversions
- ✅ Dashboard avec métriques
- ✅ Taux de conversion
- ✅ Liste des clients convertis
- ✅ Revenue tracking

## Installation & Configuration

### Prérequis
- Node.js 18+
- PostgreSQL
- Comptes API: OpenAI, Instagram/Meta, WhatsApp Business

### Installation Backend

```bash
cd backend
npm install
```

### Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `backend`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dm_manager"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Instagram
INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"
INSTAGRAM_REDIRECT_URI="http://localhost:5000/api/accounts/connect/instagram/callback"

# WhatsApp
WHATSAPP_BUSINESS_ACCOUNT_ID="your-whatsapp-business-account-id"
WHATSAPP_ACCESS_TOKEN="your-whatsapp-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_VERIFY_TOKEN="your-webhook-verify-token"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Server
PORT=5000
NODE_ENV="development"
```

### Migration de la base de données

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Lancer le backend

```bash
cd backend
npm run dev
```

### Installation Frontend

```bash
cd frontend
npm install
```

### Créez un fichier `.env` dans le dossier `frontend` (optionnel):

```env
VITE_API_URL=http://localhost:5000
```

### Lancer le frontend

```bash
cd frontend
npm run dev
```

## Déploiement sur Heroku

### 1. Créer une application Heroku

```bash
heroku create your-app-name
```

### 2. Ajouter PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

### 3. Configurer les variables d'environnement

```bash
heroku config:set JWT_SECRET="your-secret"
heroku config:set OPENAI_API_KEY="sk-your-key"
heroku config:set INSTAGRAM_APP_ID="your-id"
# ... etc pour toutes les variables
```

### 4. Déployer

```bash
git push heroku main
```

### 5. Exécuter les migrations

```bash
heroku run npx prisma migrate deploy
```

## Configuration des Webhooks

### Instagram
1. Aller dans Meta Developers (developers.facebook.com)
2. Configurer l'application Instagram
3. Webhook URL: `https://your-app.herokuapp.com/api/webhooks/instagram`
4. Verify Token: celui défini dans WHATSAPP_VERIFY_TOKEN

### WhatsApp
1. Aller dans Meta Business
2. Configurer WhatsApp Business API
3. Webhook URL: `https://your-app.herokuapp.com/api/webhooks/whatsapp`
4. Verify Token: celui défini dans WHATSAPP_VERIFY_TOKEN

## Structure du Projet

```
/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── config/      # Configuration (DB, Passport)
│   │   ├── controllers/ # Logique métier
│   │   ├── middleware/  # Auth, validation
│   │   ├── routes/      # Routes API
│   │   ├── services/    # Services (LLM, Instagram, WhatsApp)
│   │   └── utils/       # Helpers
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── contexts/    # Context API (Auth)
│   │   ├── pages/       # Pages principales
│   │   ├── services/    # API calls
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `GET /api/auth/google` - OAuth Google

### Accounts
- `GET /api/accounts` - Liste des comptes
- `GET /api/accounts/connect/instagram` - Connecter Instagram
- `POST /api/accounts/connect/whatsapp` - Connecter WhatsApp
- `DELETE /api/accounts/:id` - Supprimer un compte

### Bot Configuration
- `GET /api/bot/:accountId/config` - Configuration du bot
- `PUT /api/bot/:accountId/config` - Mettre à jour la config
- `GET /api/bot/:accountId/knowledge-base` - Knowledge base
- `POST /api/bot/:accountId/knowledge-base` - Ajouter connaissance
- `POST /api/bot/:accountId/knowledge-base/upload` - Upload document
- `DELETE /api/bot/knowledge-base/:id` - Supprimer connaissance

### Conversations
- `GET /api/conversations/accounts/:accountId/conversations` - Liste conversations
- `GET /api/conversations/:conversationId/messages` - Messages
- `POST /api/conversations/:conversationId/manual-reply` - Réponse manuelle
- `PUT /api/conversations/:conversationId/takeover` - Prendre contrôle
- `POST /api/conversations/:conversationId/mark-converted` - Marquer converti

### Webhooks
- `GET /api/webhooks/instagram` - Vérification webhook
- `POST /api/webhooks/instagram` - Recevoir messages Instagram
- `GET /api/webhooks/whatsapp` - Vérification webhook
- `POST /api/webhooks/whatsapp` - Recevoir messages WhatsApp

### Analytics
- `GET /api/analytics/:accountId` - Statistiques et conversions

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

## License

MIT


