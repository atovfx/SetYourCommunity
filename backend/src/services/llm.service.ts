import OpenAI from 'openai';
import { BotConfiguration, KnowledgeBase, Message } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateResponseParams {
  config: BotConfiguration;
  knowledgeBase: KnowledgeBase[];
  conversationHistory: Message[];
  newMessage: string;
}

export class LLMService {
  async generateResponse(params: GenerateResponseParams): Promise<string> {
    const { config, knowledgeBase, conversationHistory, newMessage } = params;

    // Construction du contexte à partir de la knowledge base
    const knowledgeContext = knowledgeBase
      .map((kb) => {
        if (kb.type === 'FAQ') {
          return `Q: ${kb.title}\nR: ${kb.content}`;
        }
        return `${kb.title}:\n${kb.content}`;
      })
      .join('\n\n');

    // Construction de l'historique de conversation
    const historyContext = conversationHistory
      .slice(-10) // Garder les 10 derniers messages
      .map((msg) => {
        const role = msg.senderType === 'CONTACT' ? 'Client' : 'Assistant';
        return `${role}: ${msg.content}`;
      })
      .join('\n');

    // Construction du system prompt
    const systemPrompt = this.buildSystemPrompt(config, knowledgeContext);

    // Appel à l'API OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Historique de conversation:\n${historyContext}\n\nNouveau message du client: ${newMessage}\n\nRéponds au client de manière naturelle et personnalisée.` },
        ],
      });

      return response.choices[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Erreur lors de la génération de la réponse');
    }
  }

  private buildSystemPrompt(config: BotConfiguration, knowledgeContext: string): string {
    let prompt = 'Tu es un assistant IA personnalisé pour gérer les messages directs d\'un infopreneur.\n\n';

    // Ajouter le system prompt personnalisé
    if (config.systemPrompt) {
      prompt += `${config.systemPrompt}\n\n`;
    }

    // Ajouter le style de réponse
    if (config.responseStyle) {
      prompt += `Style de réponse:\n${config.responseStyle}\n\n`;
    }

    // Ajouter les mimics (expressions favorites)
    if (config.mimics) {
      prompt += `Expressions et formules à utiliser:\n${config.mimics}\n\n`;
    }

    // Ajouter la knowledge base
    if (knowledgeContext) {
      prompt += `Connaissances sur l'offre et l'entreprise:\n${knowledgeContext}\n\n`;
    }

    prompt += 'Règles importantes:\n';
    prompt += '- Réponds toujours de manière professionnelle et amicale\n';
    prompt += '- Utilise les informations de la knowledge base pour répondre aux questions\n';
    prompt += '- Si tu ne connais pas la réponse, propose de mettre en contact avec le propriétaire du compte\n';
    prompt += '- Adapte ton ton et tes expressions selon le style défini\n';
    prompt += '- Reste cohérent avec l\'historique de la conversation\n';

    return prompt;
  }

  async testConnection(): Promise<boolean> {
    try {
      await openai.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export default new LLMService();


