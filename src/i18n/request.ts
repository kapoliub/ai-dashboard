'use server';

import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/utils/constants';

 
export default getRequestConfig(async ({ locale }) => {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const predefinedLocale = locale || cookieLocale || '';
  
  const localeToUse = !SUPPORTED_LOCALES.includes(predefinedLocale as typeof SUPPORTED_LOCALES[number]) ? DEFAULT_LOCALE : predefinedLocale;

  return {
    locale: localeToUse,
    messages: (await import(`../../messages/${localeToUse}.json`)).default
  };
});