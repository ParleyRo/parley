import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ViewsService } from '../core/views.service.js';
import { RadioService } from '../radio/radio.service.js';
import { findTool } from './tools.catalog.js';
@Injectable()
export class ToolsService {
  private readonly logger = new Logger(ToolsService.name);
  constructor(private readonly views: ViewsService, private readonly radio: RadioService) {}
  async render(slug: string) {
    const tool = findTool(slug);
    if (!tool) throw new NotFoundException('Utilitar inexistent.');
    if (slug === 'radio') {
      try { return this.views.render('radio/views/radio', { tool, stations: await this.radio.stations(), failed: false }); }
      catch { this.logger.warn('Radio station list unavailable.'); return this.views.render('radio/views/radio', { tool, stations: [], failed: true }); }
    }
    return this.views.render('tools/views/calculator', { tool });
  }
}
