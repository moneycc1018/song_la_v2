import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Raleway, Roboto } from "next/font/google";
import { notFound } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";

import { routing } from "@/i18n/routing";
import NextIntlProvider from "@/providers/next-intl-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import NextThemesProvider from "@/providers/theme-provider";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const raleway = Raleway({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Song La v2",
  description: "A simple song game based on ytmusic.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.variable} ${raleway.variable} antialiased`}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlProvider locale={locale} messages={messages}>
            <ReactQueryProvider>
              <Toaster />
              {children}
            </ReactQueryProvider>
          </NextIntlProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
