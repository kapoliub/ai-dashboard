import { NextIntlClientProvider, useMessages, useLocale } from 'next-intl';
import AuthProvider  from '@/components/providers/auth-provider';
import ThemeProvider from '@/components/providers/theme-provider';
// import { getLocale, getMessages, } from 'next-intl/server';
export const dynamic = 'force-dynamic'; // ⬅️ додай на час відладки


interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
}: LocaleLayoutProps) {
  const locale = useLocale(); 
  const messages = useMessages();

  console.log({locale, messages});
  

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
