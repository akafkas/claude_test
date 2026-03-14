import type { AvailabilityEvaluationInput, AvailabilityEvaluationResult, NightlyInventoryRow } from './types.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtcDate = (value: string): Date => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return parsed;
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = toUtcDate(checkIn);
  const end = toUtcDate(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);

  if (diff <= 0) {
    throw new Error('checkOut must be after checkIn');
  }

  return diff;
};

export const evaluateAvailability = (input: AvailabilityEvaluationInput): AvailabilityEvaluationResult => {
  const reasons: string[] = [];
  const nights = calculateNights(input.checkIn, input.checkOut);

  if (input.nightlyRows.length !== nights) {
    reasons.push('INCOMPLETE_AVAILABILITY_WINDOW');
    return { sellable: false, reasons, nights };
  }

  const sortedRows = [...input.nightlyRows].sort((a, b) => a.date.localeCompare(b.date));

  sortedRows.forEach((row, index) => {
    evaluateRowRules(row, index, nights, reasons);
  });

  if (sortedRows.some((row) => row.availableUnits < 1)) {
    reasons.push('NO_UNITS_AVAILABLE');
  }

  const rangeMinStay = Math.max(...sortedRows.map((row) => row.minStay ?? 1));
  const rangeMaxStay = Math.min(...sortedRows.map((row) => row.maxStay ?? Number.MAX_SAFE_INTEGER));

  if (nights < rangeMinStay) {
    reasons.push('MIN_STAY_NOT_MET');
  }

  if (nights > rangeMaxStay) {
    reasons.push('MAX_STAY_EXCEEDED');
  }

  return {
    sellable: reasons.length === 0,
    reasons,
    nights
  };
};

const evaluateRowRules = (
  row: NightlyInventoryRow,
  index: number,
  nights: number,
  reasons: string[]
): void => {
  if (row.stopSell) {
    reasons.push('STOP_SELL_ACTIVE');
  }

  if (index === 0 && row.closedToArrival) {
    reasons.push('CLOSED_TO_ARRIVAL');
  }

  if (index === nights - 1 && row.closedToDeparture) {
    reasons.push('CLOSED_TO_DEPARTURE');
  }
};
