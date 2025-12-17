import { Link } from "@/i18n/navigation";

interface NavbarProps {
  isAdmin?: boolean;
}

function Navbar({ isAdmin }: NavbarProps) {
  return (
    <nav className="flex items-center gap-4 font-medium">
      {isAdmin && <Link href="/playground">Playground</Link>}
      {isAdmin && <Link href="/action">Action</Link>}
    </nav>
  );
}

export { Navbar };
