---
name: esbuild NestJS decorator metadata fix
description: NestJS DI silently fails (injected services are undefined at runtime) when esbuild bundles without emitDecoratorMetadata support.
---

## The Rule
Any NestJS build using esbuild MUST include `@anatine/esbuild-decorators` plugin AND `emitDecoratorMetadata: true` in tsconfig. Without it, constructor-injected services resolve as `undefined` at runtime — NestJS starts and logs no errors, but every DI'd dependency is `undefined`.

**Why:** esbuild does not implement `emitDecoratorMetadata`. TypeScript emits `Reflect.metadata('design:paramtypes', [...])` calls at each decorated class constructor — this is what NestJS's DI container reads to resolve injectable types. Without it, the container has no type info and silently skips injection.

**How to apply:**
1. Install: `pnpm --filter @workspace/api-server add -D @anatine/esbuild-decorators`
2. In `build.mjs`, import `{ esbuildDecorators } from "@anatine/esbuild-decorators"` and add to `plugins: [esbuildDecorators({ tsconfig: path.resolve(artifactDir, "tsconfig.json") }), ...]` — place it BEFORE other plugins.
3. In `tsconfig.json`: add `"emitDecoratorMetadata": true` alongside `"experimentalDecorators": true`.

**Symptom to watch for:** `TypeError: Cannot read properties of undefined (reading '<methodName>')` thrown from a controller method — `this.<service>` is undefined. Healthz works because it has no injected services.
