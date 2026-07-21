import { Module } from "@nestjs/common";
import { HealthController } from "./health.ctrl";

@Module({ controllers: [HealthController] })
export class HealthModule {}
