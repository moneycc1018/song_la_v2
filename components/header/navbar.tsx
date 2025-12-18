"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

interface NavbarProps {
  isAdmin?: boolean;
}

function Navbar({ isAdmin }: NavbarProps) {
  const t = useTranslations("header");

  return (
    <nav className="flex items-center gap-4 font-medium">
      {isAdmin && <Link href="/playground">{t("playground")}</Link>}
      {isAdmin && <Link href="/action">{t("action")}</Link>}
    </nav>
  );
}

export { Navbar };
