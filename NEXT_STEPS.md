# Prochaines Étapes - À Faire par Vous

## 🚀 Démarrage Immédiat

### 1. Configuration Initiale (15 minutes)

```bash
# 1. Installer les dépendances
cd backend
npm install

cd ../frontend
npm install

# 2. Configurer PostgreSQL
# Option A: Avec Docker (recommandé)
docker run --name dm-manager-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dm_manager -p 5432:5432 -d postgres

# Option B: Installer PostgreSQL localement
# (voir la documentation officielle PostgreSQL)

# 3. Configurer les variables d'environnement
cd backend
cp .env.example .env
# Éditez .env avec vos vraies valeurs

# 4. Initialiser la base de données
npx prisma migrate dev
npx prisma generate

# 5. Lancer l'application
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 2. Obtenir les Clés API

#### OpenAI (Obligatoire pour les réponses automatiques)
1. Aller sur https://platform.openai.com
2. Créer un compte ou se connecter
3. Aller dans "API Keys"
4. Créer une nouvelle clé secrète
5. Copier la clé dans `backend/.env` → `OPENAI_API_KEY`

#### Meta Developer (Instagram + WhatsApp)
1. Aller sur https://developers.facebook.com
2. Créer une application
3. Ajouter les produits "Instagram" et "WhatsApp"
4. Configurer OAuth et les permissions
5. Copier les identifiants dans `backend/.env`

#### Google OAuth (Optionnel)
1. Aller sur https://console.cloud.google.com
2. Créer un projet
3. Activer Google+ API
4. Créer des identifiants OAuth 2.0
5. Copier dans `backend/.env`

### 3. Test Local

Une fois configuré, vous pouvez:

1. **Créer un compte**: http://localhost:5173/register
2. **Se connecter**: http://localhost:5173/login
3. **Explorer le dashboard**: http://localhost:5173/dashboard
4. **Configurer un bot** (sans compte connecté pour l'instant)

## 🎯 Phase 1 - Tests Locaux (1-2 jours)

### À Faire:

- [ ] Configurer toutes les variables d'environnement
- [ ] Tester l'inscription/connexion
- [ ] Explorer l'interface utilisateur
- [ ] Tester la configuration du bot (sans compte réel)
- [ ] Ajouter des FAQs de test
- [ ] Uploader un document de test
- [ ] Vérifier que la DB fonctionne (Prisma Studio)

### Commandes Utiles:

```bash
# Voir la base de données
cd backend
npx prisma studio

# Voir les logs backend
# (les logs s'affichent dans le terminal)

# Tester l'API directement
curl http://localhost:5000/health
```

## 🔗 Phase 2 - Connexion Instagram (2-3 jours)

### À Faire:

1. **Créer une Page Facebook**
   - Nécessaire pour Instagram Business

2. **Convertir en Compte Instagram Business**
   - Lier à votre Page Facebook

3. **Configurer l'App Meta**
   - Ajouter permissions Instagram
   - Configurer OAuth redirect URLs
   - Mode développement vs production

4. **Tester la Connexion**
   - Connecter votre compte Instagram dans l'app
   - Vérifier que le compte apparaît dans le dashboard

## 📱 Phase 3 - Connexion WhatsApp (2-3 jours)

### À Faire:

1. **Créer un Compte WhatsApp Business**
   - Via Meta Business Suite

2. **Obtenir l'Accès à l'API**
   - WhatsApp Business API (pas l'app standard)
   - Vérification du numéro

3. **Configurer les Identifiants**
   - Phone Number ID
   - Access Token
   - Business Account ID

4. **Tester la Connexion**
   - Connecter WhatsApp dans l'app
   - Envoyer un message de test

## 🔔 Phase 4 - Configuration des Webhooks (1 jour)

### À Faire:

1. **Déployer sur Heroku** (voir section suivante)

2. **Configurer Webhooks Instagram**
   - URL: `https://votre-app.herokuapp.com/api/webhooks/instagram`
   - Verify Token: celui dans votre `.env`
   - Souscrire aux événements "messages"

3. **Configurer Webhooks WhatsApp**
   - URL: `https://votre-app.herokuapp.com/api/webhooks/whatsapp`
   - Verify Token: le même
   - Souscrire aux événements "messages"

4. **Tester les Webhooks**
   - Envoyer un DM Instagram → vérifier réception
   - Envoyer un message WhatsApp → vérifier réception

## ☁️ Phase 5 - Déploiement Heroku (2-3 heures)

### À Faire:

```bash
# 1. Créer un compte Heroku (si pas déjà fait)
# https://signup.heroku.com

# 2. Installer Heroku CLI
# macOS
brew tap heroku/brew && brew install heroku
# Ou télécharger: https://devcenter.heroku.com/articles/heroku-cli

# 3. Login
heroku login

# 4. Créer l'app
heroku create votre-app-name

# 5. Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# 6. Configurer TOUTES les variables d'environnement
heroku config:set JWT_SECRET="votre-secret-fort"
heroku config:set OPENAI_API_KEY="sk-votre-clé"
heroku config:set INSTAGRAM_APP_ID="votre-id"
# ... etc pour TOUTES les variables

# Important: Mettre à jour les URLs de callback
heroku config:set INSTAGRAM_REDIRECT_URI="https://votre-app.herokuapp.com/api/accounts/connect/instagram/callback"
heroku config:set GOOGLE_CALLBACK_URL="https://votre-app.herokuapp.com/api/auth/google/callback"
heroku config:set FRONTEND_URL="https://votre-app.herokuapp.com"

# 7. Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit"

# 8. Déployer
git push heroku main

# 9. Migrer la DB
heroku run npx prisma migrate deploy

# 10. Ouvrir l'app
heroku open

# 11. Vérifier les logs
heroku logs --tail
```

## 🧪 Phase 6 - Tests End-to-End (1-2 jours)

### Scénarios à Tester:

1. **Flux Instagram Complet**
   - [ ] Connecter un compte Instagram
   - [ ] Configurer le bot (prompt, style, FAQs)
   - [ ] Uploader un document
   - [ ] Envoyer un DM à votre compte Instagram
   - [ ] Vérifier la réponse automatique
   - [ ] Prendre le contrôle manuel
   - [ ] Envoyer une réponse manuelle
   - [ ] Marquer comme converti

2. **Flux WhatsApp Complet**
   - [ ] Connecter un compte WhatsApp
   - [ ] Configurer le bot
   - [ ] Envoyer un message WhatsApp
   - [ ] Vérifier la réponse
   - [ ] Tester le mode manuel

3. **Analytics**
   - [ ] Vérifier les métriques
   - [ ] Créer des conversions
   - [ ] Vérifier le revenue tracking
   - [ ] Tester les filtres

## 🐛 Phase 7 - Debug & Optimisation (Continu)

### Points à Surveiller:

- [ ] Temps de réponse du LLM (peut être lent)
- [ ] Gestion des erreurs
- [ ] Logs détaillés
- [ ] Limites de rate des APIs
- [ ] Coûts OpenAI
- [ ] Performance de la DB

### Outils de Debug:

```bash
# Logs Heroku en temps réel
heroku logs --tail

# Logs spécifiques à l'app
heroku logs --tail --source app

# Voir la DB
heroku pg:psql

# Ouvrir Prisma Studio (localement)
cd backend && npx prisma studio
```

## 📈 Phase 8 - Amélioration Continue

### Fonctionnalités Supplémentaires (Post-MVP):

1. **Court Terme (1-2 semaines)**
   - [ ] Tests automatisés
   - [ ] Rate limiting
   - [ ] Meilleure gestion d'erreurs
   - [ ] Notifications en temps réel
   - [ ] Mode sombre

2. **Moyen Terme (1 mois)**
   - [ ] Support Claude AI
   - [ ] Templates de réponses
   - [ ] Campagnes automatisées
   - [ ] Export des données
   - [ ] Graphiques avancés

3. **Long Terme (2-3 mois)**
   - [ ] Application mobile
   - [ ] Intégration calendrier
   - [ ] Auto-qualification de leads
   - [ ] RAG avancé avec embeddings
   - [ ] Multi-langue

## 📚 Ressources Utiles

### Documentation:
- [Meta Developer Docs](https://developers.facebook.com/docs/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Heroku Docs](https://devcenter.heroku.com/)

### Fichiers de Référence:
- `README.md` - Documentation complète
- `QUICK_START.md` - Guide de démarrage rapide
- `COMMANDS.md` - Toutes les commandes utiles
- `IMPLEMENTATION_SUMMARY.md` - Résumé technique
- `backend/.env.example` - Variables d'environnement

## 💡 Conseils Importants

### Sécurité:
- ⚠️ Ne jamais commit les fichiers `.env`
- ⚠️ Utiliser des secrets forts en production
- ⚠️ Activer HTTPS sur Heroku (gratuit)
- ⚠️ Limiter les permissions des API keys

### Coûts:
- OpenAI: ~$0.002 par 1K tokens (GPT-3.5)
- Heroku: Gratuit pour commencer, puis ~$7/mois par dyno
- Meta APIs: Gratuites pour usage normal

### Performance:
- Optimiser les prompts pour réduire les tokens
- Utiliser GPT-3.5 pour les tests (moins cher)
- Monitorer les coûts OpenAI régulièrement

## 🆘 Support

### En Cas de Problème:

1. **Vérifier les logs**: `heroku logs --tail`
2. **Consulter les docs**: Voir section Ressources
3. **Variables d'env**: Vérifier qu'elles sont toutes configurées
4. **Base de données**: Vérifier les migrations
5. **GitHub Issues**: Ouvrir une issue si bug

### Questions Fréquentes:

**Q: L'app ne démarre pas localement**
A: Vérifier que PostgreSQL tourne et que `.env` est configuré

**Q: Les webhooks ne fonctionnent pas**
A: Vérifier que l'app est déployée et que les URLs sont correctes

**Q: Le bot ne répond pas**
A: Vérifier que `OPENAI_API_KEY` est valide et que `autoReply` est activé

**Q: Erreur de migration Prisma**
A: Exécuter `npx prisma migrate reset` (attention: efface les données!)

## ✅ Checklist Finale Avant Production

- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Tests end-to-end passés
- [ ] Webhooks configurés et testés
- [ ] Logs fonctionnels
- [ ] Backup de la DB configuré
- [ ] Monitoring en place
- [ ] Documentation à jour
- [ ] Secrets forts et sécurisés
- [ ] HTTPS activé

---

**Bon développement ! 🚀**

N'hésitez pas à consulter les autres fichiers de documentation pour plus de détails.


