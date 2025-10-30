import axios from 'axios';

const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

export class WhatsAppService {
  async sendMessage(to: string, message: string): Promise<any> {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      const response = await axios.post(
        `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('WhatsApp send message error:', error);
      throw new Error('Échec de l\'envoi du message WhatsApp');
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
      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              const value = change.value;
              
              if (value.messages) {
                for (const message of value.messages) {
                  // Le traitement sera géré par le conversation controller
                  console.log('WhatsApp message received:', message);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('WhatsApp webhook processing error:', error);
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      await axios.post(
        `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('WhatsApp mark as read error:', error);
    }
  }
}

export default new WhatsAppService();


