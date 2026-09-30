import { BadRequestException, Injectable } from '@nestjs/common';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { ConfigService } from '../core/config.service.js';
import { languages, presentation, textsOf, withTexts, type Presentation } from '../home/home.content.js';
@Injectable()
export class TranslationService {
  private readonly client: TranslateClient;
  private readonly cache = new Map<string, Presentation>([['en', presentation]]);
  private readonly pending = new Map<string, Promise<Presentation>>();
  constructor(config: ConfigService) {
    const aws = config.runtime.aws;
    this.client = new TranslateClient({ region: aws.region, credentials: { accessKeyId: aws.accessKeyId, secretAccessKey: aws.secretAccessKey }, maxAttempts: 2 });
  }
  async translate(language: string): Promise<Presentation> {
    if (!languages.some(([code]) => code === language)) throw new BadRequestException('Limba selectată nu este disponibilă.');
    const cached = this.cache.get(language);
    if (cached) return cached;
    const inflight = this.pending.get(language);
    if (inflight) return inflight;
    const work = this.fetch(language);
    this.pending.set(language, work);
    try { return await work; } finally { this.pending.delete(language); }
  }
  private async fetch(language: string) {
    const translated: string[] = [];
    const signal = AbortSignal.timeout(30000);
    for (const text of textsOf(presentation)) {
      const result = await this.client.send(new TranslateTextCommand({ SourceLanguageCode: 'en', TargetLanguageCode: language, Text: text }), { abortSignal: signal });
      if (!result.TranslatedText) throw new Error('Translation provider returned an empty result.');
      translated.push(result.TranslatedText);
    }
    const content = withTexts(translated);
    this.cache.set(language, content);
    return content;
  }
  onModuleDestroy() { this.client.destroy(); }
}
