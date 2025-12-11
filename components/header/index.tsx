import { ThemeSwitch } from "../theme-switch";
import { Navbar } from "./navbar";

function Header() {
  return (
    <header className="bg-background text-foreground sticky inset-x-0 top-0 z-10 flex h-16 w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold">Song La</span>
          <Navbar />
        </div>
        <ThemeSwitch />
      </div>
    </header>
  );
}

export { Header };
