import { Request, Response } from 'express';
import instagramService from '../services/instagram.service';
import whatsappService from '../services/whatsapp.service';
import { processIncomingMessage } from './conversation.controller';
import { Platform } from '@prisma/client';
import prisma from '../config/database';

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    const result = instagramService.verifyWebhook(
      mode as string,
      token as string,
      challenge as string
    );

    if (result) {
      return res.status(200).send(result);
    }
  }

  res.sendStatus(403);
};

export const handleInstagramWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        for (const messaging of entry.messaging || []) {
          if (messaging.message && messaging.message.text) {
            const recipientId = messaging.recipient.id;
            const senderId = messaging.sender.id;
            const messageText = messaging.message.text;

            // Trouver le compte correspondant
            const account = await prisma.account.findFirst({
              where: {
                accountId: recipientId,
                platform: Platform.INSTAGRAM,
                isActive: true,
              },
            });

            if (account) {
              await processIncomingMessage(
                account.id,
                senderId,
                undefined,
                messageText,
                Platform.INSTAGRAM,
                messaging.message.mid
              );
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Instagram webhook error:', error);
    res.sendStatus(500);
  }
};

export const handleWhatsAppWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const value = change.value;

            if (value.messages) {
              for (const message of value.messages) {
                if (message.type === 'text') {
                  const phoneNumberId = value.metadata.phone_number_id;
                  const from = message.from;
                  const messageText = message.text.body;

                  // Trouver le compte correspondant
                  const account = await prisma.account.findFirst({
                    where: {
                      accountId: phoneNumberId,
                      platform: Platform.WHATSAPP,
                      isActive: true,
                    },
                  });

                  if (account) {
                    await processIncomingMessage(
                      account.id,
                      from,
                      value.contacts?.[0]?.profile?.name,
                      messageText,
                      Platform.WHATSAPP,
                      message.id
                    );

                    // Marquer comme lu
                    await whatsappService.markMessageAsRead(message.id);
                  }
                }
              }
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
};


