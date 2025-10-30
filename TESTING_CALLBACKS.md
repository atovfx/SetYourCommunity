# 🧪 Guide de Test - Callbacks Meta Facebook

## ✅ Corrections Implémentées

### 1. Validation `signed_request` Correcte
- ✅ Utilisation de `base64url` (pas base64 standard)
- ✅ HMAC calculé sur le payload **brut** (string base64url), pas décodé
- ✅ Comparaison timing-safe (anti timing attacks)
- ✅ Gestion d'erreurs propre

### 2. Routes Correctement Configurées
- ✅ `POST /auth/meta/deauthorize` → Accepte form-urlencoded
- ✅ `POST /privacy/delete` → Accepte form-urlencoded
- ✅ `GET /privacy/deletion-status/:code` → Route publique pour Meta review

### 3. Format de Réponse Conforme Meta
- ✅ Deauthorization : `200 OK` (corps vide)
- ✅ Data Deletion : JSON `{url, confirmation_code}` avec UUID

---

## 🧪 Tests End-to-End

### Test A : Deauthorization Callback

#### Méthode 1 : Via Facebook UI (Recommandé)

1. **Connectez-vous à Facebook** avec un compte de test
2. Allez dans **Paramètres** → **Sécurité et connexion** → **Applications et sites web**
3. Trouvez **SetYourCommunity** dans la liste
4. Cliquez sur **"Supprimer l'app"** ou **"Retirer l'accès"**
5. **Observez les logs backend** :

```bash
# Vous devriez voir dans les logs :
[DEAUTH] Account <id> revoked for user <facebook_user_id>
[DEAUTH] Processed for Facebook user <facebook_user_id>, X account(s) disabled
```

6. **Vérifiez en base de données** :
```sql
SELECT * FROM accounts WHERE account_id = '<facebook_user_id>' AND is_active = false;
```

#### Méthode 2 : Test Manuel (Simulateur)

```bash
# Note: Difficile de générer un vrai signed_request manuellement
# Car il faut l'App Secret et le payload signé par Meta
# Mieux vaut utiliser la méthode UI ci-dessus
```

---

### Test B : Data Deletion Callback

#### Méthode 1 : Via Facebook UI

1. **Connectez-vous à Facebook** avec un compte de test
2. Allez dans **Paramètres** → **Sécurité et connexion** → **Applications et sites web**
3. Trouvez **SetYourCommunity** → **"Paramètres"** ou **"Voir les détails"**
4. Recherchez une option **"Supprimer les données"** ou **"Demander la suppression"**
5. **Confirmez la suppression**
6. **Observez les logs backend** :

```bash
# Vous devriez voir :
[DATA_DELETION] Completed for user <facebook_user_id>, X account(s) deleted, confirmation_code: <uuid>
```

7. **Vérifiez la réponse** :
   - Le callback doit retourner `200 OK` avec :
   ```json
   {
     "url": "https://app.setyourcommunity.fun/privacy/deletion-status/<uuid>",
     "confirmation_code": "<uuid>"
   }
   ```

8. **Testez l'URL de statut** :
```bash
curl https://app.setyourcommunity.fun/privacy/deletion-status/<confirmation_code>
# Devrait retourner :
{
  "confirmation_code": "<uuid>",
  "status": "completed",
  "message": "Vos données ont été supprimées avec succès.",
  "deleted_at": "2025-10-28T..."
}
```

#### Méthode 2 : Vérification Directe en BDD

```sql
-- Avant suppression
SELECT COUNT(*) FROM accounts WHERE account_id = '<facebook_user_id>';

-- Après callback (doit être 0)
SELECT COUNT(*) FROM accounts WHERE account_id = '<facebook_user_id>';
```

---

## 🔍 Vérifications Techniques

### 1. Vérifier que le Body Parser Accepte Form-URLEncoded

Les routes Meta reçoivent `form-urlencoded`, pas `JSON`. Vérifiez dans `app.ts` :

```typescript
app.use(express.urlencoded({ extended: true })); // ✅ Doit être présent
```

✅ **Déjà configuré** dans votre application.

### 2. Tester la Validation `signed_request`

Un `signed_request` valide ressemble à :
```
<signature_base64url>.<payload_base64url>
```

Exemple (format) :
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsInR5cGUiOiJkZWF1dGgifQ.signature_here
```

⚠️ **Ne créez pas de signed_request manuellement** — Meta doit l'envoyer.

### 3. Logs Détaillés

Actuellement, les logs incluent :
- `[DEAUTH]` pour les déconnexions
- `[DATA_DELETION]` pour les suppressions
- Erreurs détaillées si la validation échoue

---

## 📋 Checklist de Test Complète

### Backend ✅
- [x] Validation `signed_request` avec base64url correct
- [x] HMAC calculé sur payload brut (pas décodé)
- [x] Comparaison timing-safe
- [x] Routes acceptent form-urlencoded
- [x] Deauthorization retourne 200 OK
- [x] Data Deletion retourne JSON avec `url` et `confirmation_code`
- [x] Route de statut accessible publiquement

### Tests Fonctionnels ⏳
- [ ] Testé deauthorization via Facebook UI
- [ ] Vérifié désactivation en BDD après deauthorization
- [ ] Testé data deletion via Facebook UI
- [ ] Vérifié suppression complète en BDD après deletion
- [ ] Testé URL de statut (`/privacy/deletion-status/:code`)
- [ ] Vérifié logs backend pendant les callbacks

### Meta Dashboard Configuration ⏳
- [ ] Deauthorization URL configurée : `https://app.setyourcommunity.fun/auth/meta/deauthorize`
- [ ] Data Deletion URL configurée : `https://app.setyourcommunity.fun/privacy/delete`
- [ ] URLs testées avec le validateur Meta
- [ ] HTTPS activé en production
- [ ] Mode strict URI activé

---

## 🚨 Erreurs Communes et Fixes

### Erreur : "Invalid signed_request" (400)

**Causes possibles** :
1. HMAC calculé sur payload décodé au lieu du brut
   - ✅ **Fix** : Utiliser `payloadPart` (string) pour le HMAC, pas `payloadBuf`

2. App Secret incorrect
   - ✅ **Fix** : Vérifier `INSTAGRAM_APP_SECRET` dans `.env`

3. Body parser JSON au lieu de `urlencoded`
   - ✅ **Fix** : `app.use(express.urlencoded({ extended: true }))` doit être présent

**Debug** :
```bash
# Vérifier que signed_request arrive bien
console.log('Received signed_request:', req.body.signed_request);
```

### Erreur : "Missing signed_request" (400)

**Cause** : Meta envoie le paramètre en `form-urlencoded`, pas en JSON

**Fix** :
```typescript
const signedRequest = req.body.signed_request; // ✅ Form-urlencoded
// PAS req.body.signedRequest (camelCase JSON)
```

### Erreur : "redirect_uri_mismatch"

**Cause** : L'URL de callback n'est pas exactement dans la liste Meta Dashboard

**Fix** : Vérifier que l'URL est **EXACTEMENT** la même (pas d'espace, pas de slash final)

### Erreur : HTTP local bloqué

**Cause** : "Imposer le HTTPS" activé dans Meta Dashboard

**Options** :
1. Désactiver temporairement "Imposer le HTTPS" en dev
2. Utiliser `https://localhost:3000` avec un certificat local (mkcert)
3. Utiliser ngrok avec HTTPS

---

## 📝 Exemple de Logs Attendus

### Deauthorization Succès
```
[DEAUTH] Account abc123 revoked for user 987654321
[DEAUTH] Processed for Facebook user 987654321, 1 account(s) disabled
```

### Data Deletion Succès
```
[DATA_DELETION] Completed for user 987654321, 1 account(s) deleted, confirmation_code: 550e8400-e29b-41d4-a716-446655440000
```

### Erreur de Validation
```
Error parsing/verifying signed_request: Invalid signature: HMAC verification failed
[DEAUTH] Invalid signed_request in deauthorize callback: Error: Invalid signature: HMAC verification failed
```

---

## 🔗 URLs de Test

### Production
```
Deauthorization: https://app.setyourcommunity.fun/auth/meta/deauthorize
Data Deletion: https://app.setyourcommunity.fun/privacy/delete
Deletion Status: https://app.setyourcommunity.fun/privacy/deletion-status/<confirmation_code>
```

### Local (avec ngrok HTTPS)
```
Deauthorization: https://your-id.ngrok.io/auth/meta/deauthorize
Data Deletion: https://your-id.ngrok.io/privacy/delete
Deletion Status: https://your-id.ngrok.io/privacy/deletion-status/<confirmation_code>
```

⚠️ **Note** : En local HTTP, désactivez "Imposer le HTTPS" dans Meta Dashboard.

---

## ✅ Validation Finale pour Meta Review

Avant de soumettre pour review, vérifiez :

1. **Deauthorization fonctionne** : Testé via Facebook UI → comptes désactivés ✅
2. **Data Deletion fonctionne** : Testé via Facebook UI → données supprimées ✅
3. **Deletion Status accessible** : URL publique retourne JSON valide ✅
4. **Redirect URIs exactes** : Mode strict activé, URLs validées ✅
5. **HTTPS OK en prod** : Toutes les URLs en HTTPS ✅
6. **Logs propres** : Pas d'erreurs dans les logs pendant les callbacks ✅

---

**Une fois tous les tests validés, votre application est prête pour la review Meta ! 🎉**

