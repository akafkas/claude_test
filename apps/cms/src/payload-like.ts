export interface CmsCollection {
  slug: string;
  auth?: boolean;
  fields: Array<{ name: string; type: string; required?: boolean; defaultValue?: unknown }>;
}

export interface CmsConfig {
  admin: {
    user: string;
    loginRoute: string;
    meta?: { titleSuffix?: string };
  };
  secret: string;
  serverURL: string;
  databaseURL: string;
  collections: CmsCollection[];
}

export const buildCmsConfig = (config: CmsConfig): CmsConfig => config;
