import type { SiteTheme } from './types.js';

export const defaultTheme: SiteTheme = {
  primaryColor: '#0f172a',
  secondaryColor: '#475569',
  fontHeading: 'Inter',
  fontBody: 'Inter'
};

export const buildPropertyTheme = (overrides?: Partial<SiteTheme>): SiteTheme => {
  return {
    ...defaultTheme,
    ...overrides
  };
};
