import type { CmsAccessResult, CmsMembershipRef, CmsRequestContext, CmsRequestUser, CmsWhere } from '../payload-like.js';

const activeMemberships = (user: CmsRequestUser | undefined): CmsMembershipRef[] => {
  return (user?.memberships ?? []).filter((membership) => membership.status === 'active');
};

export const isSuperAdmin = (req: CmsRequestContext): boolean => {
  return Boolean(req.user?.isSuperAdmin);
};

export const canManageProperty = (req: CmsRequestContext): boolean => {
  if (isSuperAdmin(req)) {
    return true;
  }

  return activeMemberships(req.user).some(
    (membership) => membership.role === 'property_admin' || membership.role === 'staff'
  );
};

export const canManageOrganization = (req: CmsRequestContext): boolean => {
  if (isSuperAdmin(req)) {
    return true;
  }

  return activeMemberships(req.user).some((membership) => membership.role === 'property_admin');
};

const unique = (values: string[]): string[] => {
  return [...new Set(values)];
};

const scopedWhere = (field: string, values: string[]): { where: CmsWhere } => {
  return {
    where: {
      [field]: {
        in: unique(values)
      }
    }
  };
};

export const organizationScope = (req: CmsRequestContext): CmsAccessResult => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const organizations = activeMemberships(req.user).map((membership) => membership.organizationId);
  if (organizations.length === 0) {
    return false;
  }

  return scopedWhere('id', organizations);
};

export const propertyScope = (req: CmsRequestContext): CmsAccessResult => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const propertyIds = activeMemberships(req.user).flatMap((membership) => membership.propertyIds);
  if (propertyIds.length === 0) {
    return false;
  }

  return scopedWhere('id', propertyIds);
};

export const membershipScope = (req: CmsRequestContext): CmsAccessResult => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const user = req.user;
  if (!user) {
    return false;
  }

  return {
    where: {
      user: {
        equals: user.id
      }
    }
  };
};

export const selfUserScope = (req: CmsRequestContext): CmsAccessResult => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const userId = req.user?.id;
  if (!userId) {
    return false;
  }

  return {
    where: {
      id: {
        equals: userId
      }
    }
  };
};

export const propertyRelationScope = (
  req: CmsRequestContext,
  propertyField: string = 'property'
): CmsAccessResult => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const propertyIds = activeMemberships(req.user).flatMap((membership) => membership.propertyIds);
  if (propertyIds.length === 0) {
    return false;
  }

  return scopedWhere(propertyField, propertyIds);
};
