import { Memberships } from './collections/Memberships.js';
import { Media } from './collections/Media.js';
import { Offers } from './collections/Offers.js';
import { Organizations } from './collections/Organizations.js';
import { Pages } from './collections/Pages.js';
import { Properties } from './collections/Properties.js';
import { SiteSettings } from './collections/SiteSettings.js';
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
      SiteSettings
    ]
  });
};
