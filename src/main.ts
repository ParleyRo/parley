import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { resolve } from 'node:path';
import { AppModule } from './app.module.js';
const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
  trustProxy: true, routerOptions: { ignoreTrailingSlash: true }, bodyLimit: 8192,
}));
app.useStaticAssets({ root: resolve('public'), prefix: '/assets/' });
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 10000), process.env.HOST ?? '0.0.0.0');
