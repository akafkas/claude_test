import { buildCmsConfig } from './payload-like.js';
import { Users } from './collections/Users.js';

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
    collections: [Users]
  });
};
