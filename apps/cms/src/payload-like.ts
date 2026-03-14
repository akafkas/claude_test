export interface CmsField {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: unknown;
  relationTo?: string;
  hasMany?: boolean;
  options?: string[];
}

export type CmsWhere = Record<string, unknown>;

export interface CmsMembershipRef {
  organizationId: string;
  role: 'super_admin' | 'property_admin' | 'staff';
  propertyIds: string[];
  status: 'active' | 'inactive';
}

export interface CmsRequestUser {
  id: string;
  isSuperAdmin?: boolean;
  memberships?: CmsMembershipRef[];
}

export interface CmsRequestContext {
  user?: CmsRequestUser;
}

export type CmsAccessResult = boolean | { where: CmsWhere };

export type CmsAccessFn = (args: {
  req: CmsRequestContext;
  id?: string;
  data?: Record<string, unknown>;
}) => CmsAccessResult;

export interface CmsCollection {
  slug: string;
  auth?: boolean;
  fields: CmsField[];
  access?: Partial<Record<'read' | 'create' | 'update' | 'delete', CmsAccessFn>>;
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
