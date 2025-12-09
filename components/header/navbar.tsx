import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex items-center gap-4 font-medium">
      <Link href="/">Playground</Link>
      <Link href="/action">Action</Link>
    </nav>
  );
}

export { Navbar };
