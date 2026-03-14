import {
  createBookingSearchPageModel,
  createCheckoutPageModel,
  createConfirmationPageModel,
  createGuestDetailsPageModel,
  createQuoteSelectionPageModel,
  createSearchResultsPageModel,
  type BookingSearchPageModel,
  type CheckoutPageModel,
  type ConfirmationPageModel,
  type GuestDetailsPageModel,
  type QuoteSelectionPageModel,
  type SearchResultsPageModel
} from './pages.js';
import type {
  BookingConfirmation,
  BookingQuote,
  BookingSearchInput,
  GuestDetailsInput,
  RoomSearchResult
} from './types.js';

export type BookingFlowStep =
  | 'search'
  | 'results'
  | 'quote'
  | 'guest_details'
  | 'checkout'
  | 'confirmation';

export interface BookingFlowState {
  step: BookingFlowStep;
  search?: BookingSearchInput;
  results?: RoomSearchResult[];
  quote?: BookingQuote;
  guest?: GuestDetailsInput;
  confirmation?: BookingConfirmation;
}

export const createBookingFlow = () => {
  const initial: BookingFlowState = { step: 'search' };

  return {
    initial,
    setSearchResults: (search: BookingSearchInput, results: RoomSearchResult[]): BookingFlowState => ({
      step: 'results',
      search,
      results
    }),
    selectQuote: (state: BookingFlowState, quote: BookingQuote): BookingFlowState => ({
      ...state,
      step: 'quote',
      quote
    }),
    setGuestDetails: (state: BookingFlowState, guest: GuestDetailsInput): BookingFlowState => ({
      ...state,
      step: 'guest_details',
      guest
    }),
    proceedToCheckout: (state: BookingFlowState): BookingFlowState => ({
      ...state,
      step: 'checkout'
    }),
    confirmBooking: (state: BookingFlowState, confirmation: BookingConfirmation): BookingFlowState => ({
      ...state,
      step: 'confirmation',
      confirmation
    })
  };
};

export type BookingPageModel =
  | BookingSearchPageModel
  | SearchResultsPageModel
  | QuoteSelectionPageModel
  | GuestDetailsPageModel
  | CheckoutPageModel
  | ConfirmationPageModel;

export const buildBookingPageModel = (state: BookingFlowState): BookingPageModel => {
  switch (state.step) {
    case 'search':
      return createBookingSearchPageModel();
    case 'results':
      if (!state.search || !state.results) {
        throw new Error('Results step requires search and result data');
      }
      return createSearchResultsPageModel({ search: state.search, options: state.results });
    case 'quote':
      if (!state.quote) {
        throw new Error('Quote step requires selected quote');
      }
      return createQuoteSelectionPageModel(state.quote);
    case 'guest_details':
      if (!state.quote) {
        throw new Error('Guest details step requires selected quote');
      }
      return createGuestDetailsPageModel(state.quote);
    case 'checkout':
      if (!state.quote || !state.guest) {
        throw new Error('Checkout step requires quote and guest details');
      }
      return createCheckoutPageModel({ quote: state.quote, guest: state.guest });
    case 'confirmation':
      if (!state.quote || !state.guest || !state.confirmation) {
        throw new Error('Confirmation step requires quote, guest details and confirmation');
      }
      return createConfirmationPageModel({
        confirmation: state.confirmation,
        quote: state.quote,
        guest: state.guest
      });
  }
};
