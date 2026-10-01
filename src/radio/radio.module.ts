import { Module } from '@nestjs/common';
import { RadioService } from './radio.service.js';
@Module({ providers: [RadioService], exports: [RadioService] })
export class RadioModule {}
