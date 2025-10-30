import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

export class KnowledgeService {
  async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Échec de l\'extraction du texte du PDF');
    }
  }

  async extractTextFromFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.extractTextFromPDF(filePath);
      case '.txt':
        return fs.readFile(filePath, 'utf-8');
      default:
        throw new Error(`Type de fichier non supporté: ${ext}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }

  sanitizeText(text: string): string {
    // Nettoyer le texte extrait
    return text
      .replace(/\s+/g, ' ') // Remplacer les espaces multiples
      .replace(/\n{3,}/g, '\n\n') // Limiter les sauts de ligne
      .trim();
  }

  chunkText(text: string, maxLength: number = 2000): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

export default new KnowledgeService();


