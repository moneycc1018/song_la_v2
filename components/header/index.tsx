import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { Navbar } from "./navbar";
import { ThemeSwitch } from "./theme-switch";
import { UserNav } from "./user-nav";

async function Header() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;

  return (
    <header className="bg-background text-foreground sticky inset-x-0 top-0 z-10 flex h-16 w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold">Song La</span>
          <Navbar isAdmin={isAdmin} />
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export { Header };
