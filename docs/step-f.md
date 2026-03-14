# STEP F — Build Next.js frontend shell

## 1. What you changed

- Implemented a frontend shell module set in `apps/web` for tenant-aware branded public rendering.
- Added tenant resolution logic by custom domain and NOUS subdomain.
- Added route registry and route matcher for required public routes.
- Added CMS content fetch abstraction and theme builder to simulate Payload-driven content and branding.
- Added route shell renderer that applies per-tenant branding class.

## 2. Files created/modified

- `apps/web/src/index.ts`
- `apps/web/src/lib/types.ts`
- `apps/web/src/lib/tenant-resolution.ts`
- `apps/web/src/lib/cms-client.ts`
- `apps/web/src/lib/theme.ts`
- `apps/web/src/app/routes.ts`
- `apps/web/src/app/render.ts`
- `tests/step-f.route-smoke.test.mjs`
- `tests/step-f.tenant-resolution.test.mjs`
- `docs/step-f.md`

## 3. Why the design is correct

- Domain/subdomain tenant resolution is isolated into dedicated utilities, making it straightforward to replace with runtime host lookup middleware later.
- Content/theme loading is abstracted from route rendering, matching the requirement to fetch from Payload and apply a base theme system.
- The shell supports the required public route set and dynamic room detail route matching while keeping booking logic out of UI components.

## 4. Tests added

- `tests/step-f.route-smoke.test.mjs`
  - verifies all required public routes are registered.
  - verifies route shell rendering for tenant + route.
  - verifies dynamic `/rooms/[slug]` path support.
- `tests/step-f.tenant-resolution.test.mjs`
  - verifies domain and subdomain tenant resolution.
  - verifies inactive properties are not resolved.

## 5. Acceptance criteria status

- ✅ Property content rendering pipeline exists from CMS abstraction to route shell.
- ✅ Theme values can be provided and resolved into tenant-branded output.
- ✅ Domain/property resolution behavior is implemented and tested.
- ✅ Route smoke tests and domain/property tests are passing.

## 6. Remaining risks

- This is a shell abstraction and not yet running a full Next.js App Router runtime with server components.
- CMS client currently returns deterministic stub content; live Payload API integration is planned in later steps.

## 7. Next step

- STEP G — Implement inventory and pricing collections (`roomTypes`, `roomUnits`, `ratePlans`, `seasonRules`, `availability`, `taxRules`, `promoCodes`, `addOns`).
