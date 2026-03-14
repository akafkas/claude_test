# STEP I — Availability materialization service

## 1. What you changed

- Implemented a daily availability materializer in `booking-core` that generates day-level rows from a property/room type date window.
- Added rule application from season rules and per-day overrides, including support for:
  - stop-sell
  - closed-to-arrival
  - closed-to-departure
  - min/max stay
- Added rebuild job primitives:
  - room-type rebuild job generation
  - in-memory scheduler abstraction for queue handoff behavior

## 2. Files created/modified

- `packages/booking-core/src/types.ts` (modified)
- `packages/booking-core/src/availability-materializer.ts` (created)
- `packages/booking-core/src/rebuild-jobs.ts` (created)
- `packages/booking-core/src/index.ts` (modified)
- `tests/step-i.availability-materialization.test.mjs` (created)
- `docs/step-i.md` (created)

## 3. Why the design is correct

- Materialization logic is deterministic and pure, making it safe to run in API or worker contexts without framework coupling.
- Rules are derived in two phases (baseline season-rule projection, then explicit daily overrides), which mirrors operational hotel workflows.
- Rebuild scheduling is contract-driven (`AvailabilityRebuildScheduler`), so Step Q can wire this to Redis/queue workers without changing core logic.
- All generated rows carry organization/property/room type scope, preserving tenant boundaries.

## 4. Tests added

- `tests/step-i.availability-materialization.test.mjs`
  - verifies daily row generation over a date range.
  - verifies restriction materialization and unit counters from overrides.
  - verifies rebuild job generation and scheduler queueing behavior.

## 5. Acceptance criteria status

- ✅ Day-level availability rows are generated for future windows.
- ✅ Re-materialization behavior is deterministic and updates rows based on latest rule/override input.
- ✅ Restriction support (`stopSell`, `closedToArrival`, `closedToDeparture`, `minStay`, `maxStay`) is covered.

## 6. Remaining risks

- This step provides domain-level materialization and scheduling contracts; persistence writes and distributed queue processing are deferred to Step Q.
- Overlapping season-rule precedence currently prefers narrower date ranges; explicit priority fields may be needed later.
- Base/weekend price projection is represented in source rules but not yet persisted onto daily availability rows as separate fields.

## 7. Next step

- STEP J — Public search and quote APIs.
