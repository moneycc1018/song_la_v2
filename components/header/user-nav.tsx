"use client";

import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/navigation";

export function UserNav() {
  const { data: session } = useSession();
  const t = useTranslations("header");

  if (!session) {
    return (
      <Link href="/login" className="text-sm font-medium hover:underline">
        {t("loginNoun")}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full outline-none">
          <Avatar className="border-primary size-6 border select-none">
            <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{session.user?.name}</p>
            <p className="text-xs leading-none">{session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-custom-gray-900 mx-1" />
        <DropdownMenuItem asChild>
          <button
            className="flex w-full cursor-pointer items-center gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut />
            <span>{t("logoutVerb")}</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
