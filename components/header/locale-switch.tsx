"use client";

import { useState } from "react";

import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

function LocaleSwitch() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const allLocales = routing.locales;

  function switchLocale(newLocale: string) {
    if (newLocale !== currentLocale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full outline-none">
          <Globe size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-20" align="end" sideOffset={8}>
        {allLocales.map((locale) => (
          <DropdownMenuItem asChild key={locale}>
            <button
              className="flex w-full cursor-pointer items-center justify-between"
              onClick={() => switchLocale(locale)}
            >
              <span>{locale}</span>
              {locale === currentLocale && <Check size={20} />}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { LocaleSwitch };
