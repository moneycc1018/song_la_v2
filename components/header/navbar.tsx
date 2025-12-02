import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center gap-4">
      <Link href="/">Playground</Link>
      <Link href="/">Action</Link>
    </nav>
  );
}
