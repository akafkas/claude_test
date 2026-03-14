export interface StayDateRange {
  checkIn: string;
  checkOut: string;
}

export interface OccupancyInput {
  adults: number;
  children: number;
}

export interface NightlyInventoryRow {
  date: string;
  availableUnits: number;
  stopSell: boolean;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minStay: number | null;
  maxStay: number | null;
}

export interface AvailabilityEvaluationInput extends StayDateRange {
  occupancy: OccupancyInput;
  nightlyRows: NightlyInventoryRow[];
}

export interface AvailabilityEvaluationResult {
  sellable: boolean;
  reasons: string[];
  nights: number;
}

export interface NightlyPriceInput {
  date: string;
  basePrice: number;
  weekendPrice?: number | null;
  extraAdultPrice?: number | null;
  extraChildPrice?: number | null;
}

export interface PricingInput {
  occupancy: OccupancyInput;
  maxAdultsIncluded: number;
  maxChildrenIncluded: number;
  nightlyPrices: NightlyPriceInput[];
  currency: string;
}

export interface NightlyPriceBreakdown {
  date: string;
  base: number;
  occupancySurcharge: number;
  nightlyTotal: number;
}

export interface PricingResult {
  currency: string;
  nightlyBreakdown: NightlyPriceBreakdown[];
  subtotal: number;
}

export type TaxType = 'percent' | 'fixed';

export interface TaxRuleInput {
  name: string;
  type: TaxType;
  value: number;
  active: boolean;
}

export interface TaxLine {
  name: string;
  amount: number;
}

export interface TaxComputationResult {
  taxLines: TaxLine[];
  taxesTotal: number;
}

export type PromoType = 'percent' | 'fixed';

export interface PromoCodeInput {
  code: string;
  type: PromoType;
  value: number;
  validFrom: string;
  validTo: string;
  minStay?: number | null;
  minAmount?: number | null;
  active: boolean;
}

export interface PromotionInput {
  promoCode: string | null;
  checkIn: string;
  checkOut: string;
  subtotal: number;
  availablePromoCodes: PromoCodeInput[];
}

export interface PromotionResult {
  appliedCode: string | null;
  discountTotal: number;
  reason: string | null;
}

export interface ReservationQuote {
  subtotal: number;
  taxesTotal: number;
  discountTotal: number;
  grandTotal: number;
  currency: string;
}

export interface ReservationEngine {
  buildQuote(input: {
    pricing: PricingResult;
    taxes: TaxComputationResult;
    promotion: PromotionResult;
  }): ReservationQuote;
}

export interface SeasonRule {
  startDate: string;
  endDate: string;
  basePrice: number;
  weekendPrice: number | null;
  minStay: number | null;
  maxStay: number | null;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  stopSell: boolean;
}

export interface AvailabilityOverride {
  date: string;
  totalUnits?: number;
  bookedUnits?: number;
  heldUnits?: number;
  stopSell?: boolean;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  minStay?: number | null;
  maxStay?: number | null;
  overridePrice?: number | null;
}

export interface MaterializeAvailabilityInput {
  organizationId: string;
  propertyId: string;
  roomTypeId: string;
  startDate: string;
  endDate: string;
  roomUnitCount: number;
  seasonRules: SeasonRule[];
  overrides: AvailabilityOverride[];
}

export interface DailyAvailabilityRow {
  organizationId: string;
  propertyId: string;
  roomTypeId: string;
  date: string;
  totalUnits: number;
  bookedUnits: number;
  heldUnits: number;
  availableUnits: number;
  stopSell: boolean;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minStay: number | null;
  maxStay: number | null;
  overridePrice: number | null;
}

export interface AvailabilityRebuildJob {
  organizationId: string;
  propertyId: string;
  roomTypeId: string;
  startDate: string;
  endDate: string;
  reason: 'manual' | 'season_rule_changed' | 'inventory_changed';
}

export interface AvailabilityRebuildScheduler {
  scheduleRebuild(job: AvailabilityRebuildJob): Promise<void>;
}
