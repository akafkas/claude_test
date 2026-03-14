import type { PropertySiteProfile } from './types.js';

const normalizeHost = (host: string): string => host.trim().toLowerCase().replace(/:\d+$/, '');

export const resolvePropertyByHost = (
  host: string,
  properties: PropertySiteProfile[]
): PropertySiteProfile | undefined => {
  const safeHost = normalizeHost(host);

  return properties.find((property) => {
    if (property.status !== 'active') {
      return false;
    }

    const domainMatch = property.domain ? normalizeHost(property.domain) === safeHost : false;
    const subdomainMatch = property.subdomain ? `${property.subdomain}.nous.local` === safeHost : false;

    return domainMatch || subdomainMatch;
  });
};

export const resolvePropertyBySlug = (
  propertySlug: string,
  properties: PropertySiteProfile[]
): PropertySiteProfile | undefined => {
  return properties.find((property) => property.propertySlug === propertySlug && property.status === 'active');
};
