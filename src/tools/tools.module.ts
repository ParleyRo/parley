import { Module } from '@nestjs/common';
import { RadioModule } from '../radio/radio.module.js';
import { ToolsController } from './tools.controller.js';
import { ToolsService } from './tools.service.js';
@Module({ imports: [RadioModule], controllers: [ToolsController], providers: [ToolsService], exports: [ToolsService] })
export class ToolsModule {}
