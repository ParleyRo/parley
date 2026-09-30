import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module.js';
import { HomeModule } from './home/home.module.js';
import { TranslationModule } from './translation/translation.module.js';
@Module({ imports: [CoreModule, HomeModule, TranslationModule] })
export class AppModule {}
