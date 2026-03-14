import type { PropertySiteProfile, PropertyWebsiteContent, SiteTheme } from './types.js';
import { buildPropertyTheme } from './theme.js';

export const fetchPropertyWebsiteContent = async (args: {
  property: PropertySiteProfile;
  theme?: Partial<SiteTheme>;
}): Promise<PropertyWebsiteContent> => {
  return {
    property: args.property,
    theme: buildPropertyTheme(args.theme),
    pages: [
      { slug: '/', title: `${args.property.name} — Home`, blocks: [{ type: 'hero', value: 'Welcome' }] },
      { slug: '/rooms', title: 'Rooms', blocks: [{ type: 'list', value: 'Room list' }] },
      { slug: '/offers', title: 'Offers', blocks: [{ type: 'offers', value: 'Special offers' }] }
    ]
  };
};
