import { Injectable } from '@nestjs/common';
import type { RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../core/database.service.js';
export interface Station extends RowDataPacket { id: number; name: string; stream: string; logo: string | null }
function httpUrl(value: string | null): string {
  try { const url = new URL(value ?? ''); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
}
function logoUrl(value: string | null): string {
  if (value?.startsWith('/assets/img/')) {
    const url = new URL(value, 'https://parley.invalid');
    return url.origin === 'https://parley.invalid' && url.pathname.startsWith('/assets/img/')
      ? `${url.pathname}${url.search}${url.hash}` : '';
  }
  return httpUrl(value);
}
@Injectable()
export class RadioService {
  constructor(private readonly db: DatabaseService) {}
  async stations() {
    const rows = await this.db.query<Station>('SELECT id, name, stream, logo FROM radio ORDER BY id ASC');
    return rows.map(row => ({ id: row.id, name: row.name, stream: httpUrl(row.stream), logo: logoUrl(row.logo) }));
  }
}
