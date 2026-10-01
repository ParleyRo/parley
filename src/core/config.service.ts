import { Injectable } from '@nestjs/common';
import { createRequire } from 'node:module';
export interface RuntimeConfig {
  db: { host: string; username: string; password: string; database: string; port: string | number };
  aws: { accessKeyId: string; secretAccessKey: string; region: string };
}
@Injectable()
export class ConfigService {
  readonly runtime: RuntimeConfig;
  constructor() {
    const configPath = process.env.PARLEY_CONFIG_PATH;
    if (!configPath) throw new Error('PARLEY_CONFIG_PATH must point to the read-only runtime configuration.');
    this.runtime = createRequire(import.meta.url)(configPath) as RuntimeConfig;
    if (!this.runtime.db || !this.runtime.aws) throw new Error('Missing database or translation configuration.');
  }
}
