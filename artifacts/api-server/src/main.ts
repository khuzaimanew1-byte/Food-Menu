import "reflect-metadata";
import compression from "compression";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.mod";
import { runMigrations } from "@workspace/db";

async function boot() {
  const rawPort = process.env["PORT"];
  if (!rawPort) throw new Error("PORT env var required");
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0)
    throw new Error(`Invalid PORT: "${rawPort}"`);

  // [DB-MIGRATE] Run pending migrations before accepting traffic.
  // No-op when DATABASE_URL is absent — server still boots without a DB.
  await runMigrations();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix("api");
  // [HTTP-COMPRESS] gzip/brotli on all responses
  app.use(compression());
  app.enableCors({ origin: process.env["NODE_ENV"] === "production" ? false : true });
  app.use(cookieParser());
  await app.listen(port, "0.0.0.0");
}

boot();
