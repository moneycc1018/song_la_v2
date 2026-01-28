import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { generateCSPHeader } from "./lib/csp";

const intlMiddleware = createMiddleware(routing);

const publicPages = ["/", "/login", "/playground"];

export default async function middleware(req: NextRequest) {
  // 1. 生成動態 Nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 2. 設定 CSP
  const isDev = process.env.NODE_ENV !== "production";
  const cspHeader = generateCSPHeader(nonce, isDev);

  // 3. 檢查公開頁面
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  // 4. Auth 檢查 (Better-Auth)
  // 檢查 session cookie 是否存在
  const sessionToken =
    req.cookies.get("better-auth.session_token") || req.cookies.get("__Secure-better-auth.session_token");

  if (!isPublicPage && !sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 5. 執行 intl middleware
  const response = intlMiddleware(req);

  // 6. 處理回傳 Header
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("x-nonce", nonce);
  // 阻止網站被嵌入到 <iframe> 中
  response.headers.set("X-Frame-Options", "DENY");
  // 強制瀏覽器遵守伺服器宣告的 Content-Type
  response.headers.set("X-Content-Type-Options", "nosniff");
  // 控制 Referer header 的發送行為
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // 控制瀏覽器功能的使用權限
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|_vercel|icon.ico|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-action" },
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
