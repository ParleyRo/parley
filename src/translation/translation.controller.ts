import { BadRequestException, Body, Controller, Logger, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { TranslationService } from './translation.service.js';
import { ViewsService } from '../core/views.service.js';
@Controller('translate')
export class TranslationController {
  private readonly logger = new Logger(TranslationController.name);
  constructor(private readonly translation: TranslationService, private readonly views: ViewsService) {}
  @Post()
  async translate(@Body() body: { toLanguage?: unknown } | undefined, @Res() reply: FastifyReply) {
    try {
      if (typeof body?.toLanguage !== 'string') throw new BadRequestException();
      const content = await this.translation.translate(body.toLanguage);
      return reply.status(200).header('Cache-Control', 'no-store').type('text/html; charset=utf-8').send(this.views.render('home/views/presentation', { content, language: body.toLanguage }));
    } catch (error) {
      const invalid = error instanceof BadRequestException;
      if (!invalid) this.logger.warn('Translation provider unavailable.');
      const event = JSON.stringify({ 'translation-error': { message: invalid ? 'Alege o limbă din listă.' : 'Traducerea nu este disponibilă momentan. Încearcă din nou.' } })
        .replace(/[^\x00-\x7F]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
      return reply.status(invalid ? 400 : 502).header('HX-Trigger', event).send('');
    }
  }
}
