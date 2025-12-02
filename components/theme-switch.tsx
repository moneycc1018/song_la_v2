"use client";

import * as React from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button className="block cursor-pointer dark:hidden" onClick={() => setTheme("dark")}>
        <Sun size={20} />
      </button>
      <button className="hidden cursor-pointer dark:block" onClick={() => setTheme("light")}>
        <Moon size={20} />
      </button>
    </div>
  );
}
