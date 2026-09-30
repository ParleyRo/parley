import { Injectable, OnModuleDestroy } from '@nestjs/common';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { ConfigService } from './config.service.js';
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;
  constructor(config: ConfigService) {
    const db = config.runtime.db;
    this.pool = mysql.createPool({ host: db.host, user: db.username, password: db.password,
      database: db.database, port: Number(db.port), connectionLimit: 3,
      connectTimeout: 5000, waitForConnections: true, queueLimit: 20 });
  }
  async query<T extends RowDataPacket>(sql: string): Promise<T[]> {
    const [rows] = await this.pool.query<T[]>({ sql, timeout: 5000 });
    return rows;
  }
  async onModuleDestroy() { await this.pool.end(); }
}
