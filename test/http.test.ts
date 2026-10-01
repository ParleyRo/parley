import 'reflect-metadata';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module.js';
import { ConfigService } from '../src/core/config.service.js';
import { DatabaseService } from '../src/core/database.service.js';
import { TranslationService } from '../src/translation/translation.service.js';
import { languages, presentation } from '../src/home/home.content.js';

let app: NestFastifyApplication;
let radioFails = false;
let stationLogo = 'javascript:alert(1)';
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ConfigService).useValue({ runtime: {} })
    .overrideProvider(DatabaseService).useValue({ query: async (sql: string) => {
      assert.match(sql, /^SELECT .* FROM radio ORDER BY id ASC$/);
      if (radioFails) throw new Error('Offline');
      return [{ id: 1, name: '<script>alert(1)</script>', stream: 'https://example.test/radio', logo: stationLogo }];
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
  assert.match(result.body, /Backend &amp; integrations/);
  assert.match(result.body, /MySQL and PostgreSQL/);
  assert.match(result.body, /type="hidden" name="toLanguage" value="en"/);
  assert.match(result.body, /role="combobox" aria-autocomplete="list" aria-controls="language-options"/);
  assert.deepEqual([...result.body.matchAll(/data-language-code="([^"]+)"/g)].map(match => match[1]), languages.map(([code]) => code));
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
test('radio supports domain-independent image paths while rejecting unsafe or non-image paths', async () => {
  try {
    for (const logo of ['/assets/img/radio/europafm.webp', 'https://example.test/logo.png']) {
      stationLogo = logo;
      const result = await app.inject({ method: 'GET', url: '/tools/radio', headers: { 'hx-request': 'true' } });
      assert.equal(result.statusCode, 200);
      assert.ok(result.body.includes(`src="${logo}"`));
    }
    for (const logo of ['//example.test/logo.png', 'javascript:alert(1)', 'data:image/svg+xml,<svg/>', '/assets/img/../../health', '/assets/img/%2e%2e/../health']) {
      stationLogo = logo;
      const result = await app.inject({ method: 'GET', url: '/tools/radio', headers: { 'hx-request': 'true' } });
      assert.equal(result.statusCode, 200);
      assert.doesNotMatch(result.body, /<img /);
    }
  } finally {
    stationLogo = 'javascript:alert(1)';
  }
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
