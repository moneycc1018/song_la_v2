"use client";

import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Link } from "@/i18n/navigation";

function LoginCard() {
  const locale = useLocale();
  const t = useTranslations("login");

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: `/${locale}/playground` });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Song La</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full cursor-pointer gap-4" onClick={handleGoogleLogin}>
          <Image src="/images/google_logo.svg" alt="google" width={16} height={16} />
          {t("loginWithGoogle")}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-muted-foreground w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">Or</span>
          </div>
        </div>
        <Button className="w-full cursor-pointer" asChild>
          <Link href="/playground">{t("loginAsGuest")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export { LoginCard };
