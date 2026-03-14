import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRebuildJobsForRoomTypes,
  createInMemoryRebuildScheduler,
  materializeDailyAvailability
} from '../packages/booking-core/dist/index.js';

test('step i: generates daily availability rows from inventory and season rules', () => {
  const rows = materializeDailyAvailability({
    organizationId: 'org_1',
    propertyId: 'prop_1',
    roomTypeId: 'rt_deluxe',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    roomUnitCount: 5,
    seasonRules: [
      {
        startDate: '2026-07-01',
        endDate: '2026-07-10',
        basePrice: 180,
        weekendPrice: 220,
        minStay: 2,
        maxStay: 7,
        closedToArrival: false,
        closedToDeparture: false,
        stopSell: false
      }
    ],
    overrides: []
  });

  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((row) => row.date), ['2026-07-01', '2026-07-02', '2026-07-03']);
  assert.deepEqual(rows.map((row) => row.availableUnits), [5, 5, 5]);
  assert.deepEqual(rows.map((row) => row.minStay), [2, 2, 2]);
  assert.deepEqual(rows.map((row) => row.maxStay), [7, 7, 7]);
});

test('step i: supports stop-sell, CTA/CTD, min/max stay and inventory overrides', () => {
  const rows = materializeDailyAvailability({
    organizationId: 'org_1',
    propertyId: 'prop_1',
    roomTypeId: 'rt_standard',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    roomUnitCount: 3,
    seasonRules: [
      {
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        basePrice: 150,
        weekendPrice: null,
        minStay: 1,
        maxStay: 5,
        closedToArrival: false,
        closedToDeparture: false,
        stopSell: false
      }
    ],
    overrides: [
      {
        date: '2026-08-15',
        bookedUnits: 2,
        heldUnits: 1,
        stopSell: true,
        closedToArrival: true,
        closedToDeparture: true,
        minStay: 3,
        maxStay: 4,
        overridePrice: 199
      }
    ]
  });

  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], {
    organizationId: 'org_1',
    propertyId: 'prop_1',
    roomTypeId: 'rt_standard',
    date: '2026-08-15',
    totalUnits: 3,
    bookedUnits: 2,
    heldUnits: 1,
    availableUnits: 0,
    stopSell: true,
    closedToArrival: true,
    closedToDeparture: true,
    minStay: 3,
    maxStay: 4,
    overridePrice: 199
  });
});

test('step i: creates rebuild jobs and queues them via scheduler', async () => {
  const jobs = buildRebuildJobsForRoomTypes({
    organizationId: 'org_1',
    propertyId: 'prop_1',
    roomTypeIds: ['rt_a', 'rt_b'],
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    reason: 'season_rule_changed'
  });

  assert.equal(jobs.length, 2);
  assert.deepEqual(jobs.map((job) => job.roomTypeId), ['rt_a', 'rt_b']);

  const scheduler = createInMemoryRebuildScheduler();
  await Promise.all(jobs.map((job) => scheduler.scheduleRebuild(job)));

  assert.deepEqual(scheduler.getScheduledJobs(), jobs);
});
