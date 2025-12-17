"use client";

import { NextIntlClientProvider } from "next-intl";

export default function NextIntlProvider({ children, ...props }: React.ComponentProps<typeof NextIntlClientProvider>) {
  return <NextIntlClientProvider {...props}>{children}</NextIntlClientProvider>;
}
