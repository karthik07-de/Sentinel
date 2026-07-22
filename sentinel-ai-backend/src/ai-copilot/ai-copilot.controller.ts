import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { AiCopilotService } from './ai-copilot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class SendMessageDto {
  @IsString()
  @MinLength(1)
  content: string;
}

@ApiTags('ai-copilot')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('ai-copilot')
export class AiCopilotController {
  constructor(private readonly aiCopilotService: AiCopilotService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all chat conversations' })
  getConversations(@CurrentUser('id') userId: string) {
    return this.aiCopilotService.getConversations(userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create new conversation' })
  createConversation(@CurrentUser('id') userId: string) {
    return this.aiCopilotService.createConversation(userId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.aiCopilotService.getMessages(userId, conversationId);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message and get AI response' })
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.aiCopilotService.sendMessage(userId, conversationId, body.content);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  deleteConversation(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.aiCopilotService.deleteConversation(userId, conversationId);
  }
}
