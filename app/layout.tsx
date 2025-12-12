import type { Metadata } from "next";

import { Raleway, Roboto } from "next/font/google";

import "@/styles/globals.css";

import NextAuthProvider from "@/providers/next-auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { NextThemesProvider } from "@/providers/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${raleway.variable} antialiased`}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextAuthProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NextAuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
