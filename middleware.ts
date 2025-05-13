// middleware.ts
import {NextRequest, NextResponse} from 'next/server';
import Negotiator from 'negotiator';
import {match} from '@formatjs/intl-localematcher';
import {locales, defaultLocale} from '@/i18n/request';
import createMiddleware from 'next-intl/middleware';

function getBestLocale(req: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({headers: negotiatorHeaders}).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Пропускаємо static і API
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.match(/\.(\w+)$/)
  ) {
    return NextResponse.next();
  }

  // 1️⃣ Отримаємо локаль із cookie або Accept-Language
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  const detectedLocale = locales.includes(cookieLocale as typeof locales[number])
    ? cookieLocale
    : getBestLocale(req);

  // 2️⃣ Прокинемо локаль у request (next-intl автоматично зчитує)
  req.nextUrl.locale = detectedLocale as string;

  return NextResponse.next();
}

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never' // ⬅️ жодного /en у URL
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
