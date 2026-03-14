export interface BookingSearchInput {
  propertySlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  promoCode?: string;
}

export interface RoomSearchResult {
  roomTypeId: string;
  roomTypeSlug: string;
  roomTypeName: string;
  ratePlanId: string;
  ratePlanName: string;
  availableUnits: number;
  cancellationSummary: string;
  grandTotal: number;
  currency: string;
}

export interface NightlyQuoteLine {
  date: string;
  amount: number;
}

export interface BookingQuote {
  quoteId: string;
  roomTypeId: string;
  roomTypeName: string;
  ratePlanId: string;
  ratePlanName: string;
  nightlyBreakdown: NightlyQuoteLine[];
  subtotal: number;
  taxesTotal: number;
  discountTotal: number;
  grandTotal: number;
  currency: string;
  cancellationSnapshot: string;
}

export interface GuestDetailsInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingConfirmation {
  bookingNumber: string;
  status: 'confirmed' | 'pending_payment';
  amountPaid: number;
  amountDue: number;
  currency: string;
}
