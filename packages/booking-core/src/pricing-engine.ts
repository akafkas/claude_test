import type { NightlyPriceInput, PricingInput, PricingResult } from './types.js';

const isWeekend = (date: string): boolean => {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === 5 || day === 6;
};

const resolveNightlyBase = (night: NightlyPriceInput): number => {
  if (isWeekend(night.date) && night.weekendPrice != null) {
    return night.weekendPrice;
  }

  return night.basePrice;
};

export const calculatePricing = (input: PricingInput): PricingResult => {
  const extraAdults = Math.max(0, input.occupancy.adults - input.maxAdultsIncluded);
  const extraChildren = Math.max(0, input.occupancy.children - input.maxChildrenIncluded);

  const nightlyBreakdown = input.nightlyPrices.map((night) => {
    const base = resolveNightlyBase(night);
    const adultSurcharge = extraAdults * (night.extraAdultPrice ?? 0);
    const childSurcharge = extraChildren * (night.extraChildPrice ?? 0);
    const occupancySurcharge = adultSurcharge + childSurcharge;

    return {
      date: night.date,
      base,
      occupancySurcharge,
      nightlyTotal: base + occupancySurcharge
    };
  });

  const subtotal = nightlyBreakdown.reduce((sum, row) => sum + row.nightlyTotal, 0);

  return {
    currency: input.currency,
    nightlyBreakdown,
    subtotal
  };
};
