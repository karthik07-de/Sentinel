import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiCopilotService {
  private readonly logger = new Logger(AiCopilotService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
    });
  }

  async createConversation(userId: string) {
    return this.prisma.conversation.create({
      data: { userId, title: 'New conversation' },
    });
  }

  async getMessages(userId: string, conversationId: string) {
    const conv = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId, deletedAt: null },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv) return { messages: [] };
    return { messages: conv.messages };
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    // Save user message
    await this.prisma.message.create({
      data: { conversationId, role: 'USER', content },
    });

    // Generate AI reply
    const reply = await this.generateReply(content);

    const aiMessage = await this.prisma.message.create({
      data: { conversationId, role: 'ASSISTANT', content: reply },
    });

    // Update conversation timestamp + title if first user message
    const msgCount = await this.prisma.message.count({ where: { conversationId } });
    if (msgCount <= 2) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { title: content.substring(0, 50), updatedAt: new Date() },
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    }

    return {
      id: aiMessage.id,
      role: 'assistant',
      content: reply,
      timestamp: aiMessage.createdAt,
    };
  }

  private async generateReply(userMessage: string): Promise<string> {
    const openaiKey = this.config.get<string>('ai.openai.apiKey');
    const geminiKey = this.config.get<string>('ai.gemini.apiKey');
    const provider = this.config.get<string>('ai.provider', 'openai');

    if (provider === 'openai' && openaiKey) {
      return this.callOpenAI(userMessage, openaiKey);
    }
    if (geminiKey) {
      return this.callGemini(userMessage, geminiKey);
    }
    return this.fallbackReply(userMessage);
  }

  private async callOpenAI(message: string, apiKey: string): Promise<string> {
    try {
      const { default: OpenAI } = await import('openai');
      const client = new OpenAI({ apiKey });
      const res = await client.chat.completions.create({
        model: this.config.get<string>('ai.openai.model', 'gpt-4o-mini'),
        messages: [
          {
            role: 'system',
            content:
              'You are Sentinel AI Copilot, an expert cybersecurity assistant. Help users understand threats, analyze suspicious content, and improve their digital security. Be concise, accurate, and actionable. Format responses with markdown when helpful.',
          },
          { role: 'user', content: message },
        ],
        max_tokens: this.config.get<number>('ai.openai.maxTokens', 1024),
      });
      return res.choices[0]?.message?.content || this.fallbackReply(message);
    } catch (err) {
      this.logger.warn(`OpenAI call failed: ${err.message}`);
      return this.fallbackReply(message);
    }
  }

  private async callGemini(message: string, apiKey: string): Promise<string> {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: this.config.get<string>('ai.gemini.model', 'gemini-1.5-flash'),
      });
      const result = await model.generateContent(
        `You are Sentinel AI Copilot, an expert cybersecurity assistant. ${message}`,
      );
      return result.response.text() || this.fallbackReply(message);
    } catch (err) {
      this.logger.warn(`Gemini call failed: ${err.message}`);
      return this.fallbackReply(message);
    }
  }

  private fallbackReply(message: string): string {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('phishing') || lowerMsg.includes('email')) {
      return `**Phishing Detection Tips**\n\n1. Check the sender's domain carefully — look for subtle misspellings\n2. Hover over links before clicking to see the real destination\n3. Legitimate companies never ask for passwords via email\n4. Use our Email Scanner to analyze suspicious messages\n\nWould you like me to help analyze a specific email?`;
    }
    if (lowerMsg.includes('url') || lowerMsg.includes('link') || lowerMsg.includes('website')) {
      return `**URL Safety Check**\n\nTo verify a URL is safe:\n\n1. Use our **URL Scanner** to check against 70+ threat engines\n2. Look for HTTPS and a valid padlock icon\n3. Verify the domain spelling carefully\n4. Avoid URLs with excessive redirects\n\nPaste any URL in the URL Scanner for an instant analysis.`;
    }
    if (lowerMsg.includes('password') || lowerMsg.includes('2fa') || lowerMsg.includes('mfa')) {
      return `**Password & Account Security**\n\n- Use a unique password for every account (use a password manager)\n- Enable **Two-Factor Authentication (2FA)** on all critical accounts\n- Never share passwords or OTP codes\n- Change compromised passwords immediately\n\nYou can enable MFA for your Sentinel AI account in Settings.`;
    }
    if (lowerMsg.includes('score') || lowerMsg.includes('cyber')) {
      return `**Improving Your Cyber Score**\n\nYour Cyber Health Score improves when you:\n\n1. ✅ Scan suspicious content regularly\n2. ✅ Enable MFA on your account\n3. ✅ Maintain a daily scan streak\n4. ✅ Block detected threats\n5. ✅ Verify your email address\n\nKeep scanning daily to boost your score!`;
    }

    return `I've analyzed your question about **"${message.substring(0, 60)}"**.\n\nAs your Sentinel AI Copilot, here are my recommendations:\n\n1. Always verify the source before taking any action\n2. Use the built-in scanners to check any suspicious content\n3. Keep your software and security tools updated\n4. Enable two-factor authentication wherever possible\n\nWould you like me to run a scan or explain anything in more detail?`;
  }

  async deleteConversation(userId: string, conversationId: string) {
    await this.prisma.conversation.updateMany({
      where: { id: conversationId, userId },
      data: { deletedAt: new Date() },
    });
    return { message: 'Conversation deleted' };
  }
}
