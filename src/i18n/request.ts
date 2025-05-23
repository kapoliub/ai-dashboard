'use server';

import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/utils/constants';

 
export default getRequestConfig(async ({ locale }) => {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const predefinedLocale = locale || cookieLocale || '';
  
  const localeToUse = !SUPPORTED_LOCALES.includes(predefinedLocale as typeof SUPPORTED_LOCALES[number]) ? DEFAULT_LOCALE : predefinedLocale;

  let translationFile;

  try {
    translationFile = await import(`../../messages/${localeToUse}.json`);
  } catch (error) {
    console.error(error);
    translationFile = await import(`../../messages/${DEFAULT_LOCALE}.json`);
  }


  return {
    locale: localeToUse,
    messages: translationFile.default
  };
});