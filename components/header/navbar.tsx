"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <nav className="flex items-center gap-4 font-medium">
      <Link href="/playground">Playground</Link>
      {isAdmin && <Link href="/action">Action</Link>}
    </nav>
  );
}

export { Navbar };
