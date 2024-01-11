"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme == "dark" ? (
        <Button size='icon' variant='ghost' onClick={() => setTheme("light")}>
          <Sun />
        </Button>
      ) : (
        <Button size='icon' variant='ghost' onClick={() => setTheme("dark")}>
          <Moon />
        </Button>
      )}
    </div>
  );
}
