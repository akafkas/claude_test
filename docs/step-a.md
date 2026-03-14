# STEP A — Initialize monorepo

## What changed

- Created the monorepo directory layout for `apps/web`, `apps/cms`, `apps/worker`, and shared packages under `packages/*`.
- Added npm workspaces at the root with shared scripts for `dev`, `build`, `test`, `lint`, and formatting.
- Added shared TypeScript configuration (`tsconfig.base.json`) and workspace build references (`tsconfig.workspaces.json`).
- Added baseline ESLint and Prettier configs.
- Added initial package boundaries through TypeScript path aliases and package-level `tsconfig` references.
- Added compile-safe bootstrap modules in every app/package to validate cross-package imports.

## Deliverables

- Bootable monorepo scaffold.
- Root scripts for dev/build/test/lint/format.
- All apps/packages compile through a single workspace build.

## Acceptance criteria

- ✅ All apps/packages compile.
- ✅ Shared imports work cleanly across package boundaries.

## Tests

- Smoke build test via workspace TypeScript project references:
  - `npm run build`
- Lint/config check:
  - `npm run lint`

## Remaining risks

- Framework runtimes (Next.js/Payload/worker runtime frameworks) are not initialized yet; this step only establishes the monorepo/tooling foundation.
- Dependency installation is environment-dependent and may require registry access.

## Next step

- STEP B — Infrastructure wiring (env loading, PostgreSQL, Redis, storage abstraction, Stripe, email, logging/monitoring abstractions).
