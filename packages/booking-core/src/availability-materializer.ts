import type {
  AvailabilityOverride,
  DailyAvailabilityRow,
  MaterializeAvailabilityInput,
  SeasonRule
} from './types.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtcDate = (value: string): Date => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return parsed;
};

const toIsoDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const enumerateDates = (startDate: string, endDate: string): string[] => {
  const start = toUtcDate(startDate);
  const end = toUtcDate(endDate);
  if (end < start) {
    throw new Error('endDate must be on or after startDate');
  }

  const days = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
  return Array.from({ length: days }, (_, index) => toIsoDate(new Date(start.getTime() + index * MS_PER_DAY)));
};

const byDateRangeSpecificity = (left: SeasonRule, right: SeasonRule): number => {
  const leftSpan = toUtcDate(left.endDate).getTime() - toUtcDate(left.startDate).getTime();
  const rightSpan = toUtcDate(right.endDate).getTime() - toUtcDate(right.startDate).getTime();

  return leftSpan - rightSpan;
};

const findSeasonRuleForDate = (date: string, seasonRules: SeasonRule[]): SeasonRule | null => {
  const matching = seasonRules
    .filter((rule) => date >= rule.startDate && date <= rule.endDate)
    .sort(byDateRangeSpecificity);

  return matching[0] ?? null;
};

const buildBaselineRow = (input: MaterializeAvailabilityInput, date: string): DailyAvailabilityRow => {
  const matchedRule = findSeasonRuleForDate(date, input.seasonRules);

  return {
    organizationId: input.organizationId,
    propertyId: input.propertyId,
    roomTypeId: input.roomTypeId,
    date,
    totalUnits: input.roomUnitCount,
    bookedUnits: 0,
    heldUnits: 0,
    availableUnits: input.roomUnitCount,
    stopSell: matchedRule?.stopSell ?? false,
    closedToArrival: matchedRule?.closedToArrival ?? false,
    closedToDeparture: matchedRule?.closedToDeparture ?? false,
    minStay: matchedRule?.minStay ?? null,
    maxStay: matchedRule?.maxStay ?? null,
    overridePrice: null
  };
};

const applyOverride = (baseline: DailyAvailabilityRow, override: AvailabilityOverride): DailyAvailabilityRow => {
  const totalUnits = override.totalUnits ?? baseline.totalUnits;
  const bookedUnits = override.bookedUnits ?? baseline.bookedUnits;
  const heldUnits = override.heldUnits ?? baseline.heldUnits;

  return {
    ...baseline,
    totalUnits,
    bookedUnits,
    heldUnits,
    availableUnits: Math.max(0, totalUnits - bookedUnits - heldUnits),
    stopSell: override.stopSell ?? baseline.stopSell,
    closedToArrival: override.closedToArrival ?? baseline.closedToArrival,
    closedToDeparture: override.closedToDeparture ?? baseline.closedToDeparture,
    minStay: override.minStay === undefined ? baseline.minStay : override.minStay,
    maxStay: override.maxStay === undefined ? baseline.maxStay : override.maxStay,
    overridePrice: override.overridePrice === undefined ? baseline.overridePrice : override.overridePrice
  };
};

export const materializeDailyAvailability = (input: MaterializeAvailabilityInput): DailyAvailabilityRow[] => {
  const overrideMap = new Map(input.overrides.map((item) => [item.date, item]));

  return enumerateDates(input.startDate, input.endDate).map((date) => {
    const baseline = buildBaselineRow(input, date);
    const override = overrideMap.get(date);

    if (!override) {
      return baseline;
    }

    return applyOverride(baseline, override);
  });
};
