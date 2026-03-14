import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyPromotion,
  calculateNights,
  calculatePricing,
  calculateTaxes,
  createReservationEngine,
  evaluateAvailability
} from '../packages/booking-core/dist/index.js';

test('step h: availability engine returns sellable result for valid range', () => {
  const result = evaluateAvailability({
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    occupancy: { adults: 2, children: 1 },
    nightlyRows: [
      {
        date: '2026-06-12',
        availableUnits: 3,
        stopSell: false,
        closedToArrival: false,
        closedToDeparture: false,
        minStay: 2,
        maxStay: 7
      },
      {
        date: '2026-06-13',
        availableUnits: 2,
        stopSell: false,
        closedToArrival: false,
        closedToDeparture: false,
        minStay: 2,
        maxStay: 7
      },
      {
        date: '2026-06-14',
        availableUnits: 1,
        stopSell: false,
        closedToArrival: false,
        closedToDeparture: false,
        minStay: 2,
        maxStay: 7
      }
    ]
  });

  assert.equal(result.sellable, true);
  assert.deepEqual(result.reasons, []);
  assert.equal(result.nights, 3);
});

test('step h: availability engine blocks CTA/CTD and min/max restrictions deterministically', () => {
  const result = evaluateAvailability({
    checkIn: '2026-06-12',
    checkOut: '2026-06-14',
    occupancy: { adults: 2, children: 0 },
    nightlyRows: [
      {
        date: '2026-06-12',
        availableUnits: 1,
        stopSell: false,
        closedToArrival: true,
        closedToDeparture: false,
        minStay: 3,
        maxStay: 5
      },
      {
        date: '2026-06-13',
        availableUnits: 1,
        stopSell: false,
        closedToArrival: false,
        closedToDeparture: true,
        minStay: 3,
        maxStay: 5
      }
    ]
  });

  assert.equal(result.sellable, false);
  assert.deepEqual(result.reasons, ['CLOSED_TO_ARRIVAL', 'CLOSED_TO_DEPARTURE', 'MIN_STAY_NOT_MET']);
});

test('step h: pricing + taxes + promotions produce deterministic quote totals', () => {
  const pricing = calculatePricing({
    occupancy: { adults: 3, children: 1 },
    maxAdultsIncluded: 2,
    maxChildrenIncluded: 0,
    currency: 'EUR',
    nightlyPrices: [
      {
        date: '2026-06-12',
        basePrice: 200,
        weekendPrice: 250,
        extraAdultPrice: 20,
        extraChildPrice: 10
      },
      {
        date: '2026-06-13',
        basePrice: 220,
        weekendPrice: 260,
        extraAdultPrice: 20,
        extraChildPrice: 10
      }
    ]
  });

  assert.deepEqual(pricing.nightlyBreakdown, [
    {
      date: '2026-06-12',
      base: 250,
      occupancySurcharge: 30,
      nightlyTotal: 280
    },
    {
      date: '2026-06-13',
      base: 260,
      occupancySurcharge: 30,
      nightlyTotal: 290
    }
  ]);
  assert.equal(pricing.subtotal, 570);

  const taxes = calculateTaxes(pricing.subtotal, [
    { name: 'City Tax', type: 'fixed', value: 15, active: true },
    { name: 'VAT', type: 'percent', value: 10, active: true }
  ]);

  assert.equal(taxes.taxesTotal, 72);

  const promo = applyPromotion({
    promoCode: 'SUMMER10',
    checkIn: '2026-06-12',
    checkOut: '2026-06-14',
    subtotal: pricing.subtotal,
    availablePromoCodes: [
      {
        code: 'SUMMER10',
        type: 'percent',
        value: 10,
        validFrom: '2026-01-01',
        validTo: '2026-12-31',
        minStay: 2,
        minAmount: 300,
        active: true
      }
    ]
  });

  assert.equal(promo.discountTotal, 57);

  const reservationEngine = createReservationEngine();
  const quote = reservationEngine.buildQuote({ pricing, taxes, promotion: promo });

  assert.deepEqual(quote, {
    subtotal: 570,
    taxesTotal: 72,
    discountTotal: 57,
    grandTotal: 585,
    currency: 'EUR'
  });
});

test('step h: invalid check-out range throws', () => {
  assert.throws(() => calculateNights('2026-06-15', '2026-06-15'), /checkOut must be after checkIn/);
});
