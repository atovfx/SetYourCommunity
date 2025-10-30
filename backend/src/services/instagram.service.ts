import axios from 'axios';

const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class InstagramService {
  async getAuthUrl(redirectUri: string, userId?: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID || '',
      redirect_uri: redirectUri,
      scope: 'instagram_basic,instagram_manage_messages,pages_messaging,pages_show_list',
      response_type: 'code',
    });

    // Ajouter le state avec l'userId pour la sécurité
    if (userId) {
      const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
      params.append('state', state);
    }

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<any> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/oauth/access_token`, {
        params: {
          client_id: process.env.INSTAGRAM_APP_ID,
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          redirect_uri: redirectUri,
          code,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Instagram token exchange error:', error);
      throw new Error('Échec de l\'échange du code d\'autorisation');
    }
  }

  async getAccountInfo(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/me`, {
        params: {
          fields: 'id,name,username',
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Instagram account info error:', error);
      throw new Error('Échec de la récupération des informations du compte');
    }
  }

  async sendMessage(accessToken: string, recipientId: string, message: string): Promise<any> {
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/me/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
        },
        {
          params: { access_token: accessToken },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Instagram send message error:', error);
      throw new Error('Échec de l\'envoi du message Instagram');
    }
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_verify_token';
    
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    
    return null;
  }

  async processWebhook(body: any): Promise<void> {
    try {
      if (body.object === 'instagram') {
        for (const entry of body.entry) {
          for (const messaging of entry.messaging || []) {
            if (messaging.message) {
              // Le traitement sera géré par le conversation controller
              console.log('Instagram message received:', messaging);
            }
          }
        }
      }
    } catch (error) {
      console.error('Instagram webhook processing error:', error);
    }
  }
}

export default new InstagramService();

