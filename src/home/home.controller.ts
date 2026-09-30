import { Controller, Get, Header, NotFoundException, Query, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ViewsService } from '../core/views.service.js';
import { languages, presentation } from './home.content.js';
import { tools, findTool } from '../tools/tools.catalog.js';
import { ToolsService } from '../tools/tools.service.js';
@Controller()
export class HomeController {
  constructor(private readonly views: ViewsService, private readonly utilities: ToolsService) {}
  @Get('/')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async index(@Query('tool') slug?: string) {
    if (slug !== undefined && !findTool(slug)) throw new NotFoundException('Utilitar inexistent.');
    return this.views.render('home/views/index', {
      content: presentation, language: 'en', languages, tools, assets: this.views.assets(),
      initialTool: slug ?? '', initialModal: slug ? await this.utilities.render(slug) : '',
    });
  }
  @Get('hobby/pescuit/lungimeFire')
  line(@Res() reply: FastifyReply) { return reply.redirect('/?tool=line-length', 302); }
  @Get('hobby/pescuit/putereAruncareDinLbs')
  casting(@Res() reply: FastifyReply) { return reply.redirect('/?tool=casting-weight', 302); }
  @Get('hobby/math/regula3simpla')
  math(@Res() reply: FastifyReply) { return reply.redirect('/?tool=rule-of-three', 302); }
  @Get('hobby/radio')
  radio(@Res() reply: FastifyReply) { return reply.redirect('/?tool=radio', 302); }
  @Get('health')
  health() { return { status: 'ok', app: 'parley-v2' }; }
}
