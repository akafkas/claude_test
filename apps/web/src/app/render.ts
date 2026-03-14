import { brandClassName } from '@nous/ui';

import type { PropertyWebsiteContent } from '../lib/types.js';

export const renderRouteShell = (args: {
  pathname: string;
  content: PropertyWebsiteContent;
}): { html: string; route: string; brandClass: string } => {
  const brandClass = brandClassName(args.content.property.propertySlug);
  const title = args.content.pages.find((page) => page.slug === args.pathname)?.title ?? args.content.property.name;

  return {
    route: args.pathname,
    brandClass,
    html: `<main class="${brandClass}" data-route="${args.pathname}"><h1>${title}</h1></main>`
  };
};
