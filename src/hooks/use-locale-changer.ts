'use client';

import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function useLocaleChanger() {
    const router = useRouter();
    const locale = useLocale();

    const changeLocale = useCallback(async (lng: string) => {
        if (lng === locale) return;  // Already active
        Cookies.set('NEXT_LOCALE', lng);
        // Set the locale without changing the URL
        router.refresh();
        // Force a hard refresh to ensure all components are re-rendered with new locale
    }, [locale, router]);

    return {currentLocale: locale, changeLocale};
}