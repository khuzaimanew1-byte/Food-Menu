import { Global, Module } from '@nestjs/common';
import { db }             from '@workspace/db';

// [DB-POOL] exports the singleton drizzle instance backed by pg.Pool
export const DB_TOKEN = Symbol('DB');

@Global()
@Module({
  providers: [{ provide: DB_TOKEN, useValue: db }],
  exports:   [DB_TOKEN],
})
export class DbMod {}
