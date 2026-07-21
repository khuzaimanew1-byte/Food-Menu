import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { HealthModule } from "./health/health.mod";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env["LOG_LEVEL"] ?? "info",
        redact: [
          "req.headers.authorization",
          "req.headers.cookie",
          "res.headers['set-cookie']",
        ],
        serializers: {
          req(req: { id: unknown; method: string; url?: string }) {
            return {
              id: req.id,
              method: req.method,
              url: req.url?.split("?")[0],
            };
          },
          res(res: { statusCode: number }) {
            return { statusCode: res.statusCode };
          },
        },
        ...(process.env["NODE_ENV"] !== "production" && {
          transport: { target: "pino-pretty", options: { colorize: true } },
        }),
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
