export interface PropertySiteProfile {
  id: string;
  propertySlug: string;
  name: string;
  domain?: string;
  subdomain?: string;
  status: 'active' | 'inactive';
}

export interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  fontHeading: string;
  fontBody: string;
}

export interface CmsPage {
  slug: string;
  title: string;
  blocks: Array<{ type: string; value: string }>;
}

export interface PropertyWebsiteContent {
  property: PropertySiteProfile;
  theme: SiteTheme;
  pages: CmsPage[];
}
