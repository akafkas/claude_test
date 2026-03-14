import test from 'node:test';
import assert from 'node:assert/strict';

import { publicRoutes } from '../apps/web/dist/app/routes.js';
import { createBookingFlow, buildBookingPageModel } from '../apps/web/dist/booking/flow.js';
import { renderBookingPage } from '../apps/web/dist/booking/render.js';

test('step k: booking journey routes exist in public route registry', () => {
  const routes = publicRoutes;

  assert.deepEqual(
    routes.slice(-5),
    [
      '/booking/results',
      '/booking/quote',
      '/booking/guest-details',
      '/booking/checkout',
      '/booking/confirmation'
    ]
  );
});

test('step k: booking flow transitions from search to confirmation', () => {
  const flow = createBookingFlow();

  const search = {
    propertySlug: 'villa-blue',
    checkIn: '2026-10-01',
    checkOut: '2026-10-04',
    adults: 2,
    children: 1,
    promoCode: 'AUTUMN10'
  };

  const options = [
    {
      roomTypeId: 'rt_1',
      roomTypeSlug: 'deluxe-suite',
      roomTypeName: 'Deluxe Suite',
      ratePlanId: 'rp_flex',
      ratePlanName: 'Flexible Rate',
      availableUnits: 2,
      cancellationSummary: 'Free cancellation up to 48h',
      grandTotal: 780,
      currency: 'USD'
    }
  ];

  const quote = {
    quoteId: 'quote_1',
    roomTypeId: 'rt_1',
    roomTypeName: 'Deluxe Suite',
    ratePlanId: 'rp_flex',
    ratePlanName: 'Flexible Rate',
    nightlyBreakdown: [
      { date: '2026-10-01', amount: 240 },
      { date: '2026-10-02', amount: 260 },
      { date: '2026-10-03', amount: 280 }
    ],
    subtotal: 780,
    taxesTotal: 78,
    discountTotal: 20,
    grandTotal: 838,
    currency: 'USD',
    cancellationSnapshot: 'Free cancellation up to 48h before arrival.'
  };

  const guest = {
    firstName: 'Avery',
    lastName: 'Stone',
    email: 'avery@example.com',
    phone: '+123456789'
  };

  const confirmation = {
    bookingNumber: 'NOUS-100234',
    status: 'confirmed',
    amountPaid: 838,
    amountDue: 0,
    currency: 'USD'
  };

  const resultsState = flow.setSearchResults(search, options);
  assert.equal(resultsState.step, 'results');

  const quoteState = flow.selectQuote(resultsState, quote);
  assert.equal(quoteState.step, 'quote');

  const guestState = flow.setGuestDetails(quoteState, guest);
  assert.equal(guestState.step, 'guest_details');

  const checkoutState = flow.proceedToCheckout(guestState);
  assert.equal(checkoutState.step, 'checkout');

  const confirmationState = flow.confirmBooking(checkoutState, confirmation);
  assert.equal(confirmationState.step, 'confirmation');

  const confirmationModel = buildBookingPageModel(confirmationState);
  assert.equal(confirmationModel.route, '/booking/confirmation');
  const confirmationHtml = renderBookingPage(confirmationModel);
  assert.match(confirmationHtml, /booking:NOUS-100234/);
});

test('step k: checkout page model carries backend quote totals', () => {
  const flow = createBookingFlow();
  const state = flow.proceedToCheckout(
    flow.setGuestDetails(
      flow.selectQuote(
        flow.setSearchResults(
          {
            propertySlug: 'villa-blue',
            checkIn: '2026-11-11',
            checkOut: '2026-11-12',
            adults: 2,
            children: 0
          },
          [
            {
              roomTypeId: 'rt_2',
              roomTypeSlug: 'garden-room',
              roomTypeName: 'Garden Room',
              ratePlanId: 'rp_nonref',
              ratePlanName: 'Non-refundable',
              availableUnits: 1,
              cancellationSummary: 'Non-refundable',
              grandTotal: 180,
              currency: 'USD'
            }
          ]
        ),
        {
          quoteId: 'quote_2',
          roomTypeId: 'rt_2',
          roomTypeName: 'Garden Room',
          ratePlanId: 'rp_nonref',
          ratePlanName: 'Non-refundable',
          nightlyBreakdown: [{ date: '2026-11-11', amount: 180 }],
          subtotal: 180,
          taxesTotal: 18,
          discountTotal: 0,
          grandTotal: 198,
          currency: 'USD',
          cancellationSnapshot: 'Non-refundable'
        }
      ),
      {
        firstName: 'Taylor',
        lastName: 'Rivers',
        email: 'taylor@example.com',
        phone: '+1987654321',
        specialRequests: 'Late check-in'
      }
    )
  );

  const checkoutModel = buildBookingPageModel(state);
  assert.equal(checkoutModel.route, '/booking/checkout');
  const checkoutHtml = renderBookingPage(checkoutModel);
  assert.match(checkoutHtml, /due-now:\$198\.00/);
});
