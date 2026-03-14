import { loadAppEnvironment, type EnvMap } from '@nous/config';

import { hasPublicRoute, publicRoutes } from './app/routes.js';
import { renderRouteShell } from './app/render.js';
import { fetchPropertyWebsiteContent } from './lib/cms-client.js';
import { resolvePropertyByHost } from './lib/tenant-resolution.js';
import type { PropertySiteProfile, SiteTheme } from './lib/types.js';
import {
  buildBookingPageModel,
  createBookingFlow,
  type BookingFlowState
} from './booking/flow.js';
import { renderBookingPage } from './booking/render.js';
import type {
  BookingConfirmation,
  BookingQuote,
  BookingSearchInput,
  GuestDetailsInput,
  RoomSearchResult
} from './booking/types.js';

const runtimeEnv = (): EnvMap => {
  const runtime = globalThis as unknown as { process?: { env?: EnvMap } };
  return runtime.process?.env ?? {};
};

export const webBootMessage = (): string => {
  const env = loadAppEnvironment(runtimeEnv());
  return `web-ready:${env.appUrl}`;
};

export const webHealthConfig = (): { appUrl: string; nodeEnv: string } => {
  const env = loadAppEnvironment(runtimeEnv());
  return { appUrl: env.appUrl, nodeEnv: env.nodeEnv };
};

export const supportedPublicRoutes = (): readonly string[] => publicRoutes;

export const resolveTenantSite = (args: {
  host: string;
  properties: PropertySiteProfile[];
}): PropertySiteProfile | undefined => {
  return resolvePropertyByHost(args.host, args.properties);
};

export const buildTenantRouteShell = async (args: {
  host: string;
  pathname: string;
  properties: PropertySiteProfile[];
  theme?: Partial<SiteTheme>;
}): Promise<{ html: string; route: string; brandClass: string } | undefined> => {
  if (!hasPublicRoute(args.pathname)) {
    return undefined;
  }

  const property = resolvePropertyByHost(args.host, args.properties);
  if (!property) {
    return undefined;
  }

  const content = await fetchPropertyWebsiteContent({
    property,
    ...(args.theme ? { theme: args.theme } : {})
  });
  return renderRouteShell({ pathname: args.pathname, content });
};

export const bookingFlowFactory = () => createBookingFlow();

export const buildBookingJourneyPage = (state: BookingFlowState): { route: string; html: string } => {
  const model = buildBookingPageModel(state);
  return {
    route: model.route,
    html: renderBookingPage(model)
  };
};

export type { PropertySiteProfile, PropertyWebsiteContent, SiteTheme } from './lib/types.js';
export type { BookingFlowState } from './booking/flow.js';
export type {
  BookingConfirmation,
  BookingQuote,
  BookingSearchInput,
  GuestDetailsInput,
  RoomSearchResult
} from './booking/types.js';
