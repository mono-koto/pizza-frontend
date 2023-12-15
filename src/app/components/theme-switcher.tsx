"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div>
        <Button size='icon' variant='ghost' onClick={() => setTheme("light")}>
          <LoaderIcon className='animate-spin' />
        </Button>
      </div>
    );

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
