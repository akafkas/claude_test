# STEP C — Stand up Payload CMS

## 1. What you changed

- Added a CMS base configuration module (`apps/cms/src/payload.config.ts`) with admin config, database config input, and auth-enabled `users` collection.
- Added `users` collection base schema (`apps/cms/src/collections/Users.ts`) including required auth profile fields.
- Added CMS startup module (`apps/cms/src/server.ts`) that resolves environment config and returns admin login URL metadata.
- Updated CMS package scripts to include a dedicated start command.
- Added a startup test for CMS configuration and admin login route metadata.

## 2. Files created/modified

- `apps/cms/package.json`
- `apps/cms/src/collections/Users.ts`
- `apps/cms/src/payload-like.ts`
- `apps/cms/src/payload.config.ts`
- `apps/cms/src/server.ts`
- `apps/cms/src/index.ts`
- `tests/step-c.payload-startup.test.mjs`
- `docs/step-c.md`

## 3. Why the design is correct

- CMS config is isolated in one place and fed from infrastructure env loading implemented in Step B.
- Auth base is in place through the `users` collection definition and admin-user binding.
- Startup metadata includes a deterministic admin login route (`/admin/login`) so webops can verify runtime wiring.

## 4. Tests added

- `tests/step-c.payload-startup.test.mjs`
  - validates config generation
  - validates users auth wiring
  - validates startup admin login URL metadata

## 5. Acceptance criteria status

- ✅ Payload-style CMS config boots locally through startup wiring.
- ✅ Admin login route metadata is available (`/admin/login`).
- ✅ Startup test added and passing.
- ⚠️ Real Payload package runtime initialization is blocked in this environment due registry access policy (HTTP 403 for `payload` packages).

## 6. Remaining risks

- Real admin panel rendering/login UI cannot be verified until package registry allows installing official Payload packages.
- Database adapter is config-ready but not connected to a live Payload runtime yet.

## 7. Next step

- STEP D — implement auth and multi-tenancy collections (`users`, `organizations`, `memberships`, `properties`) with role-based tenant-scoped access controls.
