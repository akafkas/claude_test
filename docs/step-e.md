# STEP E — CMS collections and branding model

## 1. What you changed

- Added CMS content collections for `pages`, `offers`, and `media`.
- Added `siteSettings` collection with branding fields (`logo`, colors, fonts, nav/footer, SEO defaults, analytics IDs).
- Added reusable property-relation scoping helper for tenant-scoped access on property-linked collections.
- Updated Payload config to register new Step E collections.

## 2. Files created/modified

- `apps/cms/src/auth/tenant-access.ts`
- `apps/cms/src/collections/Pages.ts`
- `apps/cms/src/collections/Offers.ts`
- `apps/cms/src/collections/Media.ts`
- `apps/cms/src/collections/SiteSettings.ts`
- `apps/cms/src/payload.config.ts`
- `tests/step-e.collections-validation.test.mjs`
- `docs/step-e.md`

## 3. Why the design is correct

- All new content/branding records are tenant-scoped via `property` relationship filters for non-super-admin users.
- Branding model is property-specific, enabling unique white-label settings per property.
- Collection shapes align with required Step E field sets and prepare the frontend to consume editable CMS-driven content.

## 4. Tests added

- `tests/step-e.collections-validation.test.mjs`
  - verifies Step E collections are registered in CMS config.
  - verifies required field sets for `pages`, `offers`, and `siteSettings`.
  - verifies tenant property scope is applied to branding content access.

## 5. Acceptance criteria status

- ✅ Content manager can edit homepage-style content via `pages` and `offers` models.
- ✅ Property-specific branding configuration is available via `siteSettings`.
- ✅ Collection validation tests added and passing.

## 6. Remaining risks

- This step provides schema/access controls; rich editor UX and media upload pipeline behavior still depend on full Payload runtime wiring.
- Single-record-per-property enforcement for `siteSettings` (unique constraint) is not implemented yet.

## 7. Next step

- STEP F — initialize Next.js frontend shell with tenant-aware domain resolution and Payload content rendering.
