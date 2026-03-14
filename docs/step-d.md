# STEP D — Implement auth and multi-tenancy

## 1. What you changed

- Expanded the CMS schema model to support access-control functions and tenant-aware request context.
- Added tenant-scoping/access helper utilities for super admin, property admin, and staff role behavior.
- Added `organizations`, `memberships`, and `properties` collections with role-based access rules.
- Updated `users` collection with self-scope access for non-super-admin users.
- Wired Step D collections into Payload config in strict order (`users`, `organizations`, `memberships`, `properties`).

## 2. Files created/modified

- `apps/cms/src/payload-like.ts`
- `apps/cms/src/auth/tenant-access.ts`
- `apps/cms/src/collections/Users.ts`
- `apps/cms/src/collections/Organizations.ts`
- `apps/cms/src/collections/Memberships.ts`
- `apps/cms/src/collections/Properties.ts`
- `apps/cms/src/payload.config.ts`
- `tests/step-d.access-control.test.mjs`
- `tests/step-d.tenant-isolation.test.mjs`
- `docs/step-d.md`

## 3. Why the design is correct

- Tenant scoping is centralized in dedicated access utilities, avoiding repeated authorization logic in each collection.
- Super admins are globally unrestricted while property admins/staff are constrained by active membership data.
- Membership and user self-access rules prevent horizontal access across users and organizations.
- Property and organization reads always return explicit filtered scopes for non-super-admin users.

## 4. Tests added

- `tests/step-d.access-control.test.mjs`
  - validates role behavior for super admin, property admin, and staff.
  - validates required Step D collection registration.
- `tests/step-d.tenant-isolation.test.mjs`
  - validates denial when memberships are missing/inactive.
  - validates membership/user self-scope filters.

## 5. Acceptance criteria status

- ✅ `super_admin` can see/manage all tenant records.
- ✅ `property_admin` can only scope to assigned organization/property.
- ✅ `staff` is restricted from org/membership management and scoped to assigned properties.
- ✅ Access-control and tenant-isolation tests are added and passing.

## 6. Remaining risks

- Membership assignment validation (e.g., ensuring property belongs to membership organization) is not yet enforced with collection hooks.
- Data-level constraints are currently logical; DB-level constraints and RLS are planned later.

## 7. Next step

- STEP E — implement CMS collections (`pages`, `offers`, `media`, `siteSettings`) and property branding configuration.
