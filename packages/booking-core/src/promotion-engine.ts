import type { PromoCodeInput, PromotionInput, PromotionResult } from './types.js';
import { calculateNights } from './availability-engine.js';

const inDateRange = (checkIn: string, promo: PromoCodeInput): boolean => {
  return checkIn >= promo.validFrom && checkIn <= promo.validTo;
};

export const applyPromotion = (input: PromotionInput): PromotionResult => {
  if (!input.promoCode) {
    return { appliedCode: null, discountTotal: 0, reason: 'NO_PROMO_CODE' };
  }

  const normalizedCode = input.promoCode.trim().toUpperCase();
  const found = input.availablePromoCodes.find((promo) => promo.code.toUpperCase() === normalizedCode);

  if (!found || !found.active) {
    return { appliedCode: null, discountTotal: 0, reason: 'PROMO_NOT_FOUND' };
  }

  if (!inDateRange(input.checkIn, found)) {
    return { appliedCode: null, discountTotal: 0, reason: 'PROMO_OUTSIDE_VALIDITY' };
  }

  const nights = calculateNights(input.checkIn, input.checkOut);
  if (found.minStay != null && nights < found.minStay) {
    return { appliedCode: null, discountTotal: 0, reason: 'PROMO_MIN_STAY_NOT_MET' };
  }

  if (found.minAmount != null && input.subtotal < found.minAmount) {
    return { appliedCode: null, discountTotal: 0, reason: 'PROMO_MIN_AMOUNT_NOT_MET' };
  }

  const discountTotal =
    found.type === 'percent' ? (input.subtotal * found.value) / 100 : Math.min(found.value, input.subtotal);

  return {
    appliedCode: found.code,
    discountTotal,
    reason: null
  };
};
