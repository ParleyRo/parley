import 'reflect-metadata';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module.js';
import { ConfigService } from '../src/core/config.service.js';
import { DatabaseService } from '../src/core/database.service.js';
import { TranslationService } from '../src/translation/translation.service.js';
import { presentation } from '../src/home/home.content.js';

let app: NestFastifyApplication;
let radioFails = false;
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ConfigService).useValue({ runtime: {} })
    .overrideProvider(DatabaseService).useValue({ query: async (sql: string) => {
      assert.match(sql, /^SELECT .* FROM radio ORDER BY id ASC$/);
      if (radioFails) throw new Error('Offline');
      return [{ id: 1, name: '<script>alert(1)</script>', stream: 'https://example.test/radio', logo: 'javascript:alert(1)' }];
    } })
    .overrideProvider(TranslationService).useValue({ translate: async (language: string) => {
      if (language === 'ro') throw new Error('Provider offline');
      return presentation;
    } }).compile();
  app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter({ routerOptions: { ignoreTrailingSlash: true } }));
  app.useLogger(false);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});
after(async () => { await app?.close(); });
test('home preserves the presentation and orders the navigation with Radio immediately after the default page', async () => {
  const result = await app.inject({ method: 'GET', url: '/' });
  assert.equal(result.statusCode, 200);
  assert.match(result.headers['content-type']!, /text\/html/);
  assert.match(result.body, /Back-end Banter/);
  assert.match(result.body, /MongoDB is my flexible friend/);
  assert.deepEqual([...result.body.matchAll(/data-section="([^"]+)"/g)].map(match => match[1]), ['about', 'radio', 'line-length', 'casting-weight', 'rule-of-three']);
  assert.match(result.body, /data-initial-section="about"/);
  assert.equal((result.body.match(/<audio /g) ?? []).length, 1);
  assert.doesNotMatch(result.body, /eficienta\.|facturamea\.|Invoice organizer|bulma|vue\.esm|<dialog|hamburger/i);
});
test('partial requests, direct tool links and legacy links resolve correctly', async () => {
  for (const slug of ['line-length', 'casting-weight', 'rule-of-three', 'radio']) {
    const fragment = await app.inject({ method: 'GET', url: `/tools/${slug}`, headers: { 'hx-request': 'true' } });
    assert.equal(fragment.statusCode, 200);
    assert.ok(fragment.body.includes(`id="title-${slug}"`));
    assert.doesNotMatch(fragment.body, /<!doctype html>/);
    const direct = await app.inject({ method: 'GET', url: `/tools/${slug}` });
    assert.equal(direct.headers.location, `/?tool=${slug}`);
    const page = await app.inject({ method: 'GET', url: `/?tool=${slug}` });
    assert.equal(page.statusCode, 200);
    assert.ok(page.body.includes(`data-initial-section="${slug}"`));
    assert.ok(page.body.includes(`id="title-${slug}"`));
  }
  const legacy = await app.inject({ method: 'GET', url: '/hobby/pescuit/lungimeFire' });
  assert.equal(legacy.headers.location, '/?tool=line-length');
  assert.equal((await app.inject({ method: 'GET', url: '/tools/unknown' })).statusCode, 404);
  assert.equal((await app.inject({ method: 'GET', url: '/?tool=unknown' })).statusCode, 404);
});
test('CV and contact have directly addressable empty sections', async () => {
  for (const section of ['cv', 'contact']) {
    const page = await app.inject({ method: 'GET', url: `/?section=${section}` });
    assert.equal(page.statusCode, 200);
    assert.ok(page.body.includes(`data-initial-section="${section}"`));
    assert.match(page.body, new RegExp(`id="panel-${section}"[^>]*>\\s*<div class="panel-heading">[\\s\\S]*?</div>\\s*</section>`));
  }
  assert.equal((await app.inject({ method: 'GET', url: '/?section=missing' })).statusCode, 404);
});
test('radio escapes database content, rejects unsafe URLs and offers retry on DB failure', async () => {
  const result = await app.inject({ method: 'GET', url: '/tools/radio', headers: { 'hx-request': 'true' } });
  assert.match(result.body, /&lt;script&gt;/);
  assert.doesNotMatch(result.body, /<script>|javascript:alert/);
  radioFails = true;
  const failure = await app.inject({ method: 'GET', url: '/tools/radio', headers: { 'hx-request': 'true' } });
  radioFails = false;
  assert.match(failure.body, /Nu am putut încărca/);
  assert.match(failure.body, /Reîncearcă/);
});
test('translation returns escaped HTML and signals failures without replacing the presentation', async () => {
  const translated = await app.inject({ method: 'POST', url: '/translate', headers: { 'content-type': 'application/x-www-form-urlencoded' }, payload: 'toLanguage=en' });
  assert.equal(translated.statusCode, 200);
  assert.match(translated.body, /data-language="en"/);
  const failure = await app.inject({ method: 'POST', url: '/translate', payload: { toLanguage: 'ro' } });
  assert.equal(failure.statusCode, 502);
  assert.match(String(failure.headers['hx-trigger']), /translation-error/);
  assert.equal(failure.body, '');
  assert.equal((await app.inject({ method: 'POST', url: '/translate', payload: {} })).statusCode, 400);
});
