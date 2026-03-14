# STEP K — Booking UI flow

## 1. What you changed

- Added a booking-journey module in `apps/web` that models the full user flow as typed page-state transitions.
- Implemented page models for:
  - booking search
  - search results
  - quote selection
  - guest details
  - checkout
  - confirmation
- Added deterministic booking-page rendering helpers that consume backend-provided quote totals.
- Extended the frontend public route registry to include booking journey sub-routes.

## 2. Files created/modified

- `apps/web/src/booking/types.ts` (created)
- `apps/web/src/booking/pages.ts` (created)
- `apps/web/src/booking/flow.ts` (created)
- `apps/web/src/booking/render.ts` (created)
- `apps/web/src/app/routes.ts` (modified)
- `apps/web/src/index.ts` (modified)
- `tests/step-k.booking-ui-flow.test.mjs` (created)
- `docs/step-k.md` (created)

## 3. Why the design is correct

- Booking logic remains outside React components and outside route rendering; the flow uses typed state transitions and pure model factories.
- The journey is implemented in step order and constrained to frontend UX concerns for Step K, while pricing/totals come from quote payloads rather than client-side recalculation.
- Public route coverage includes all booking journey pages needed for mobile-first progression.

## 4. Tests added

- `tests/step-k.booking-ui-flow.test.mjs`
  - verifies booking routes are registered.
  - verifies end-to-end flow state transitions from search to confirmation.
  - verifies checkout/confirmation rendering carries backend quote totals consistently.

## 5. Acceptance criteria status

- ✅ Guest can progress through search → quote → guest details → checkout → confirmation state flow.
- ✅ Booking route coverage includes the booking journey pages.
- ✅ Totals displayed in checkout/confirmation are sourced from backend quote values.
- ✅ Component/route-level smoke behavior is covered with automated tests.

## 6. Remaining risks

- This step provides flow/state and renderer abstractions; a real Next.js component tree and browser E2E tests will be needed when wiring actual App Router pages.
- Payment handling and backend confirmation APIs are intentionally deferred to Step L and Step M.

## 7. Next step

- STEP L — Stripe payment integration.
