# STEP G — Inventory and pricing collections

## 1. What you changed

- Added inventory and pricing collections in the CMS layer for `roomTypes`, `roomUnits`, `ratePlans`, `seasonRules`, `availability`, `taxRules`, `promoCodes`, and `addOns`.
- Registered all new collections in Payload config so they are available in admin/backend wiring.
- Applied tenant-scoped access patterns consistently to all new collections using shared tenant access helpers.

## 2. Files created/modified

- `apps/cms/src/collections/RoomTypes.ts`
- `apps/cms/src/collections/RoomUnits.ts`
- `apps/cms/src/collections/RatePlans.ts`
- `apps/cms/src/collections/SeasonRules.ts`
- `apps/cms/src/collections/Availability.ts`
- `apps/cms/src/collections/TaxRules.ts`
- `apps/cms/src/collections/PromoCodes.ts`
- `apps/cms/src/collections/AddOns.ts`
- `apps/cms/src/payload.config.ts`
- `tests/step-g.inventory-pricing-schema.test.mjs`
- `docs/step-g.md`

## 3. Why the design is correct

- All entities are property-scoped at the schema level via required `property` relationships where needed, satisfying tenant boundary requirements.
- Access control is centralized through existing `propertyRelationScope` and `canManageProperty` helpers, keeping authorization behavior consistent with prior steps.
- Required field sets from the MVP domain model are represented in each collection with sensible defaults for operational flags (`active`, restrictions, counts).

## 4. Tests added

- `tests/step-g.inventory-pricing-schema.test.mjs`
  - validates all Step G collection slugs are registered.
  - validates minimum required field names for each collection.
  - validates tenant-scoped read/update and create access behavior.

## 5. Acceptance criteria status

- ✅ Property manager can define room inventory and pricing entities through configured schemas.
- ✅ All Step G entities are tenant-scoped via `property` relation scoping.
- ✅ Schema validation tests added and passing.

## 6. Remaining risks

- Current model is schema-focused and does not yet enforce cross-collection invariants (for example roomType/property consistency), which will need service-layer checks in later steps.
- No availability materialization/rebuild logic exists yet (planned for Step I).

## 7. Next step

- STEP H — Build `packages/booking-core` with pure availability/pricing/tax/promotion engines and reservation interfaces.
