import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service.js';
import { TranslationController } from './translation.controller.js';
@Module({ providers: [TranslationService], controllers: [TranslationController] })
export class TranslationModule {}
