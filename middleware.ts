import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname === "/" || pathname.startsWith("/playground")) {
        return true;
      }

      if (pathname.startsWith("/action")) {
        return !!token && token.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.ico|login).*)"],
};
