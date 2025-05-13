import {getRequestConfig} from 'next-intl/server';

export const locales = [
    'en', // English
    'es', // Español
    'fr', // Français
    'de', // Deutsch
  ] as const;
  
  export const defaultLocale = 'en';
 
export default getRequestConfig(async ({ locale }) => {
  const localeToUse = !locale || !locales.includes(locale as typeof locales[number]) ? defaultLocale : locale;

  return {
    locale: localeToUse,
    messages: (await import(`../../messages/${localeToUse}.json`)).default
  };
});