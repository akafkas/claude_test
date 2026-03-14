import type {
  BookingConfirmation,
  BookingQuote,
  BookingSearchInput,
  GuestDetailsInput,
  RoomSearchResult
} from './types.js';

export interface BookingSearchPageModel {
  route: '/booking';
  title: string;
  fields: Array<'checkIn' | 'checkOut' | 'adults' | 'children' | 'promoCode'>;
  defaultAdults: number;
  defaultChildren: number;
}

export interface SearchResultsPageModel {
  route: '/booking/results';
  title: string;
  search: BookingSearchInput;
  options: RoomSearchResult[];
}

export interface QuoteSelectionPageModel {
  route: '/booking/quote';
  title: string;
  selectedRoomType: string;
  selectedRatePlan: string;
  quote: BookingQuote;
}

export interface GuestDetailsPageModel {
  route: '/booking/guest-details';
  title: string;
  quote: BookingQuote;
  requiredFields: Array<keyof GuestDetailsInput>;
}

export interface CheckoutPageModel {
  route: '/booking/checkout';
  title: string;
  quote: BookingQuote;
  guest: GuestDetailsInput;
  totalDueNow: number;
}

export interface ConfirmationPageModel {
  route: '/booking/confirmation';
  title: string;
  confirmation: BookingConfirmation;
  quote: BookingQuote;
  guest: GuestDetailsInput;
}

export const createBookingSearchPageModel = (): BookingSearchPageModel => ({
  route: '/booking',
  title: 'Book your stay',
  fields: ['checkIn', 'checkOut', 'adults', 'children', 'promoCode'],
  defaultAdults: 2,
  defaultChildren: 0
});

export const createSearchResultsPageModel = (args: {
  search: BookingSearchInput;
  options: RoomSearchResult[];
}): SearchResultsPageModel => ({
  route: '/booking/results',
  title: 'Available rooms',
  search: args.search,
  options: [...args.options]
});

export const createQuoteSelectionPageModel = (quote: BookingQuote): QuoteSelectionPageModel => ({
  route: '/booking/quote',
  title: 'Select your quote',
  selectedRoomType: quote.roomTypeName,
  selectedRatePlan: quote.ratePlanName,
  quote
});

export const createGuestDetailsPageModel = (quote: BookingQuote): GuestDetailsPageModel => ({
  route: '/booking/guest-details',
  title: 'Guest details',
  quote,
  requiredFields: ['firstName', 'lastName', 'email', 'phone']
});

export const createCheckoutPageModel = (args: {
  quote: BookingQuote;
  guest: GuestDetailsInput;
}): CheckoutPageModel => ({
  route: '/booking/checkout',
  title: 'Checkout',
  quote: args.quote,
  guest: args.guest,
  totalDueNow: args.quote.grandTotal
});

export const createConfirmationPageModel = (args: {
  confirmation: BookingConfirmation;
  quote: BookingQuote;
  guest: GuestDetailsInput;
}): ConfirmationPageModel => ({
  route: '/booking/confirmation',
  title: 'Booking confirmed',
  confirmation: args.confirmation,
  quote: args.quote,
  guest: args.guest
});
