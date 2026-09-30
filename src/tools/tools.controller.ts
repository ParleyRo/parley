import { Controller, Get, Headers, Param, Res, NotFoundException } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ToolsService } from './tools.service.js';
import { findTool } from './tools.catalog.js';
@Controller('tools')
export class ToolsController {
  constructor(private readonly tools: ToolsService) {}
  @Get(':slug')
  async show(@Param('slug') slug: string, @Headers('hx-request') hx: string | undefined, @Res() reply: FastifyReply) {
    if (!findTool(slug)) throw new NotFoundException();
    reply.header('Vary', 'HX-Request');
    if (hx !== 'true') return reply.redirect(`/?tool=${slug}`);
    return reply.type('text/html; charset=utf-8').send(await this.tools.render(slug));
  }
}
