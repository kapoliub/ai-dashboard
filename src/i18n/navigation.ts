import {createNavigation} from 'next-intl/navigation';
import {locales, defaultLocale} from '@/i18n/request';

export const {
  Link,
  useRouter,
  usePathname,
  redirect
} = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'never'          // URL без /en
});
