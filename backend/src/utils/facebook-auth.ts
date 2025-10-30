import crypto from 'crypto';

/**
 * Décodage base64url (conversion standard base64 pour Node.js)
 */
function base64UrlDecode(input: string): Buffer {
  // Conversion base64url → base64 standard
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  // Ajout du padding nécessaire
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64');
}

/**
 * Valide et décode un signed_request de Facebook/Meta
 * Format: base64url(signature).base64url(payload)
 * 
 * IMPORTANT: Le HMAC doit être calculé sur le payload brut (string base64url),
 * PAS sur le payload décodé !
 * 
 * @param signedRequest - Le signed_request reçu de Facebook (form-urlencoded dans body)
 * @param appSecret - Le App Secret (INSTAGRAM_APP_SECRET)
 * @returns Les données décodées si valide, null sinon
 */
export function parseAndVerifySignedRequest(
  signedRequest: string, 
  appSecret: string
): any {
  try {
    const [sigPart, payloadPart] = signedRequest.split('.');
    
    if (!sigPart || !payloadPart) {
      throw new Error('Invalid signed_request format: missing parts');
    }

    // Décoder le payload (base64url → JSON)
    const payloadBuf = base64UrlDecode(payloadPart);
    const payload = JSON.parse(payloadBuf.toString('utf8'));

    // Vérifier l'algorithme (doit être HMAC-SHA256)
    if (payload.algorithm && payload.algorithm !== 'HMAC-SHA256') {
      throw new Error(`Unsupported algorithm: ${payload.algorithm}`);
    }

    // Calculer la signature attendue
    // IMPORTANT: HMAC sur la partie payload BRUTE (string, pas décodée)
    const expectedSig = crypto
      .createHmac('sha256', appSecret)
      .update(payloadPart) // ← Payload brut (string base64url), pas décodé !
      .digest();

    // Décoder la signature reçue
    const givenSig = base64UrlDecode(sigPart);

    // Comparaison timing-safe pour éviter les timing attacks
    if (givenSig.length !== expectedSig.length) {
      throw new Error('Signature length mismatch');
    }

    if (!crypto.timingSafeEqual(givenSig, expectedSig)) {
      throw new Error('Invalid signature: HMAC verification failed');
    }

    return payload;
  } catch (error) {
    console.error('Error parsing/verifying signed_request:', error);
    throw error; // Relancer pour que le controller puisse gérer
  }
}

/**
 * Valide un signed_request avec l'App Secret depuis l'environnement
 * Version wrapper pour faciliter l'utilisation
 */
export function validateSignedRequest(signedRequest: string): any | null {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!appSecret) {
    console.error('INSTAGRAM_APP_SECRET not configured');
    return null;
  }

  try {
    return parseAndVerifySignedRequest(signedRequest, appSecret);
  } catch (error) {
    return null;
  }
}

/**
 * Extrait l'userId (app-scoped ID) du signed_request
 */
export function getUserIdFromSignedRequest(signedRequest: string): string | null {
  const payload = validateSignedRequest(signedRequest);
  return payload?.user_id || payload?.userId || null;
}

