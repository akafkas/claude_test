# STEP H — Build booking-core package

## 1. What you changed

- Replaced placeholder booking-core export with a full domain package implementation.
- Added pure business engines for:
  - availability evaluation (`evaluateAvailability`, `calculateNights`)
  - pricing computation (`calculatePricing`)
  - tax computation (`calculateTaxes`)
  - promo application (`applyPromotion`)
  - reservation quote composition (`createReservationEngine`)
- Added explicit booking-core domain DTOs/interfaces so services can integrate through stable typed contracts.

## 2. Files created/modified

- `packages/booking-core/src/index.ts` (modified)
- `packages/booking-core/src/types.ts` (created)
- `packages/booking-core/src/availability-engine.ts` (created)
- `packages/booking-core/src/pricing-engine.ts` (created)
- `packages/booking-core/src/tax-engine.ts` (created)
- `packages/booking-core/src/promotion-engine.ts` (created)
- `packages/booking-core/src/reservation-engine.ts` (created)
- `tests/step-h.booking-core.test.mjs` (created)
- `docs/step-h.md` (created)

## 3. Why the design is correct

- Booking logic remains fully isolated in `packages/booking-core`, satisfying the package boundary rule and preventing React/UI coupling.
- The package is provider-agnostic and contains no OTA-specific logic; only internal booking domain concepts are modeled.
- Deterministic calculations are enforced:
  - availability outcome derives only from nightly rows + date range
  - pricing always resolves base + occupancy surcharge per night
  - taxes apply in fixed order over subtotal
  - promo application follows explicit validation gates
- Reservation quote building is separated behind an interface-based engine contract for clean downstream orchestration.

## 4. Tests added

- `tests/step-h.booking-core.test.mjs`
  - verifies valid sellable availability path.
  - verifies restriction failures (CTA/CTD/min-stay).
  - verifies deterministic pricing/tax/promo composition and final totals.
  - verifies invalid date range handling.

## 5. Acceptance criteria status

- ✅ Search-like availability input produces sellable/non-sellable results with explicit reasons.
- ✅ Pricing breakdown is deterministic and reproducible for the same input.
- ✅ Unit tests cover pricing, taxes, promotions, and core restrictions.

## 6. Remaining risks

- Rounding strategy is currently JavaScript number arithmetic; financial decimal handling should be hardened when integrating checkout/confirmation flow.
- Availability engine validates rules and inventory counts but does not yet perform DB locking (planned in transactional confirmation steps).
- Promotion usage limits (`maxUses`) are intentionally deferred until persistence-backed booking confirmation.

## 7. Next step

- STEP I — Availability materialization service (daily availability table generation, restriction materialization, rebuild jobs).
