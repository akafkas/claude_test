import type { BookingPageModel } from './flow.js';

const formatMoney = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const renderBookingPage = (model: BookingPageModel): string => {
  switch (model.route) {
    case '/booking':
      return `<section data-step="search"><h2>${model.title}</h2></section>`;
    case '/booking/results':
      return `<section data-step="results"><h2>${model.title}</h2><p>options:${model.options.length}</p></section>`;
    case '/booking/quote':
      return `<section data-step="quote"><h2>${model.title}</h2><p>${model.selectedRoomType} · ${model.selectedRatePlan}</p><p>${formatMoney(model.quote.grandTotal, model.quote.currency)}</p></section>`;
    case '/booking/guest-details':
      return `<section data-step="guest-details"><h2>${model.title}</h2><p>required:${model.requiredFields.join(',')}</p></section>`;
    case '/booking/checkout':
      return `<section data-step="checkout"><h2>${model.title}</h2><p>${model.guest.firstName} ${model.guest.lastName}</p><p>due-now:${formatMoney(model.totalDueNow, model.quote.currency)}</p></section>`;
    case '/booking/confirmation':
      return `<section data-step="confirmation"><h2>${model.title}</h2><p>booking:${model.confirmation.bookingNumber}</p><p>${formatMoney(model.quote.grandTotal, model.quote.currency)}</p></section>`;
  }
};
