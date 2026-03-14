export const publicRoutes = [
  '/',
  '/rooms',
  '/rooms/[slug]',
  '/offers',
  '/gallery',
  '/location',
  '/contact',
  '/policies',
  '/booking',
  '/manage-booking'
] as const;

export const hasPublicRoute = (pathname: string): boolean => {
  if (publicRoutes.includes(pathname as (typeof publicRoutes)[number])) {
    return true;
  }

  return /^\/rooms\/[a-z0-9-]+$/i.test(pathname);
};
