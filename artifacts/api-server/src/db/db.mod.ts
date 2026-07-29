import { Global, Module } from '@nestjs/common';
import { getDb }          from '@workspace/db';

// [DB-LAZY] useFactory defers pool creation to DI time (not import time).
// If DATABASE_URL is absent the factory returns null — the server boots fine
// and MenuSvc will re-try getDb() on every request until the URL appears.
export const DB_TOKEN = Symbol('DB');

@Global()
@Module({
  providers: [{ provide: DB_TOKEN, useFactory: () => getDb() }],
  exports:   [DB_TOKEN],
})
export class DbMod {}
