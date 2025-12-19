"use client";

import * as React from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button className="block cursor-pointer dark:hidden" onClick={() => setTheme("dark")}>
        <SunIcon size={20} />
      </button>
      <button className="hidden cursor-pointer dark:block" onClick={() => setTheme("light")}>
        <MoonIcon size={20} />
      </button>
    </div>
  );
}

export { ThemeSwitch };
