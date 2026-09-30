import { Injectable } from '@nestjs/common';
import { Eta } from 'eta';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
@Injectable()
export class ViewsService {
  private readonly eta = new Eta({
    views: process.env.NODE_ENV === 'production' ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve('src'),
    cache: process.env.NODE_ENV === 'production',
  });
  private assetsCache?: { script: string; styles: string[] };
  render(template: string, data: Record<string, unknown> = {}) { return this.eta.render(template, data); }
  assets() {
    if (this.assetsCache) return this.assetsCache;
    const manifest = JSON.parse(readFileSync(resolve('public/build/.vite/manifest.json'), 'utf8'));
    const entry = manifest['frontend/main.ts'];
    const assets = { script: `/assets/build/${entry.file}`, styles: (entry.css ?? []).map((file: string) => `/assets/build/${file}`) };
    if (process.env.NODE_ENV === 'production') this.assetsCache = assets;
    return assets;
  }
}
