import { NextIntlClientProvider } from 'next-intl';
import AuthProvider  from '@/components/providers/auth-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { getMessages, getLocale } from 'next-intl/server';
import ToastProvider from '@/components/providers/toast-provider';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
}: LocaleLayoutProps) {
  const locale = await getLocale(); 
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
