import cookie from 'cookie'

let locales = ['en-US', 'de', 'fr', 'it', 'jp']

export function middleware(request) {
  let { pathname } = request.nextUrl
  
  // Parse the cookies from the request
  const cookies = cookie.parse(request.headers.get('Cookie') || '')
  const cookieLocale = cookies.lang || 'en-US'

  const requestLocale = locales.find((reqLocale) => pathname.startsWith(`/${reqLocale}/`) || pathname === `/${reqLocale}`)
  
  // Ignore image and video files
  const isMediaFile = /\.(jpe?g|png|gif|svg|mp4|ico)$/i.test(pathname)
  
  if (isMediaFile) return

  if (requestLocale && requestLocale !== cookieLocale) {
    request.nextUrl.pathname = pathname.replace(`/${requestLocale}`, `/${cookieLocale}`)
    return Response.redirect(request.nextUrl)  }

  if (!requestLocale) {
    request.nextUrl.pathname = `/${cookieLocale}${pathname}`
    return Response.redirect(request.nextUrl)
  }
}
 
export const config = {
    matcher: ['/((?!_next).*)']
}