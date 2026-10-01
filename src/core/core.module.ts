import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service.js';
import { DatabaseService } from './database.service.js';
import { ViewsService } from './views.service.js';
@Global()
@Module({ providers: [ConfigService, DatabaseService, ViewsService], exports: [ConfigService, DatabaseService, ViewsService] })
export class CoreModule {}
