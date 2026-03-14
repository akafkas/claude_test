import { AddOns } from './collections/AddOns.js';
import { Availability } from './collections/Availability.js';
import { Memberships } from './collections/Memberships.js';
import { Media } from './collections/Media.js';
import { Offers } from './collections/Offers.js';
import { Organizations } from './collections/Organizations.js';
import { Pages } from './collections/Pages.js';
import { PromoCodes } from './collections/PromoCodes.js';
import { Properties } from './collections/Properties.js';
import { RatePlans } from './collections/RatePlans.js';
import { RoomTypes } from './collections/RoomTypes.js';
import { RoomUnits } from './collections/RoomUnits.js';
import { SeasonRules } from './collections/SeasonRules.js';
import { SiteSettings } from './collections/SiteSettings.js';
import { TaxRules } from './collections/TaxRules.js';
import { Users } from './collections/Users.js';
import { buildCmsConfig } from './payload-like.js';

export const createPayloadConfig = (args: {
  databaseURL: string;
  payloadSecret: string;
  serverURL: string;
}) => {
  return buildCmsConfig({
    admin: {
      user: Users.slug,
      loginRoute: '/admin/login',
      meta: {
        titleSuffix: '- NOUS CMS'
      }
    },
    secret: args.payloadSecret,
    serverURL: args.serverURL,
    databaseURL: args.databaseURL,
    collections: [
      Users,
      Organizations,
      Memberships,
      Properties,
      Media,
      Pages,
      Offers,
      SiteSettings,
      RoomTypes,
      RoomUnits,
      RatePlans,
      SeasonRules,
      Availability,
      TaxRules,
      PromoCodes,
      AddOns
    ]
  });
};
