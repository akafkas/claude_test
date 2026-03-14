import type { ReservationEngine } from './types.js';

export const createReservationEngine = (): ReservationEngine => {
  return {
    buildQuote: ({ pricing, taxes, promotion }) => {
      const grandTotal = Math.max(0, pricing.subtotal + taxes.taxesTotal - promotion.discountTotal);

      return {
        subtotal: pricing.subtotal,
        taxesTotal: taxes.taxesTotal,
        discountTotal: promotion.discountTotal,
        grandTotal,
        currency: pricing.currency
      };
    }
  };
};
