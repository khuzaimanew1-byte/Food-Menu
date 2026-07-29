import { Module }     from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD }   from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.mod';
import { DbMod }        from './db/db.mod';
import { MenuMod }      from './menu/menu.mod';

@Module({
  imports: [
    // [SEC-RATE] 120 req/min per IP
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 120 }] }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env['LOG_LEVEL'] ?? 'info',
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          "res.headers['set-cookie']",
        ],
        serializers: {
          req(req: { id: unknown; method: string; url?: string }) {
            return { id: req.id, method: req.method, url: req.url?.split('?')[0] };
          },
          res(res: { statusCode: number }) {
            return { statusCode: res.statusCode };
          },
        },
        ...(process.env['NODE_ENV'] !== 'production' && {
          transport: { target: 'pino-pretty', options: { colorize: true } },
        }),
      },
    }),
    DbMod,
    HealthModule,
    MenuMod,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
