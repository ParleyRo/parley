import { Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module.js';
import { HomeController } from './home.controller.js';
@Module({ imports: [ToolsModule], controllers: [HomeController] })
export class HomeModule {}
