/* Temporarily disabled for debugging
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'ms', 'ta'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
*/

// Simple middleware to prevent 404s during debugging
export function middleware() {
  return;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 