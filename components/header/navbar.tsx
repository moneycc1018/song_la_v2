import Link from "next/link";

interface NavbarProps {
  isAdmin?: boolean;
}

function Navbar({ isAdmin }: NavbarProps) {
  return (
    <nav className="flex items-center gap-4 font-medium">
      <Link href="/playground">Playground</Link>
      {isAdmin && <Link href="/action">Action</Link>}
    </nav>
  );
}

export { Navbar };
