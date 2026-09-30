import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TranslateClient } from '@aws-sdk/client-translate';
import { TranslationService } from '../src/translation/translation.service.js';
import { ConfigService } from '../src/core/config.service.js';
import { presentation, textsOf } from '../src/home/home.content.js';

const config = { runtime: { aws: { region: 'eu-west-1', accessKeyId: 'test', secretAccessKey: 'test' } } } as ConfigService;
test('English and invalid languages make no provider requests', async context => {
  const send = context.mock.method(TranslateClient.prototype, 'send', (() => { throw new Error('Unexpected provider call'); }) as typeof TranslateClient.prototype.send);
  const service = new TranslationService(config);
  assert.deepEqual(await service.translate('en'), presentation);
  await assert.rejects(service.translate('invalid'));
  assert.equal(send.mock.callCount(), 0);
  service.onModuleDestroy();
});
test('concurrent and repeated requests share a complete translation', async context => {
  const send = context.mock.method(TranslateClient.prototype, 'send', (async (command: { input: { Text: string } }) => ({ TranslatedText: `RO: ${command.input.Text}` })) as typeof TranslateClient.prototype.send);
  const service = new TranslationService(config);
  const [first, concurrent] = await Promise.all([service.translate('ro'), service.translate('ro')]);
  assert.deepEqual(first, concurrent);
  assert.equal(first.sections.length, 4);
  assert.equal(first.sections[0].items.length, 4);
  assert.deepEqual(await service.translate('ro'), first);
  assert.equal(send.mock.callCount(), textsOf(presentation).length);
  service.onModuleDestroy();
});
test('provider failure does not poison cache and allows retry', async context => {
  let failed = false;
  context.mock.method(TranslateClient.prototype, 'send', (async () => {
    if (!failed) { failed = true; throw new Error('Provider offline'); }
    return { TranslatedText: 'Translated text' };
  }) as typeof TranslateClient.prototype.send);
  const service = new TranslationService(config);
  await assert.rejects(service.translate('ro'));
  assert.equal((await service.translate('ro')).intro, 'Translated text');
  service.onModuleDestroy();
});
