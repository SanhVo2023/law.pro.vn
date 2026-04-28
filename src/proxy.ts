import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/admin`, `/_next`, `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
