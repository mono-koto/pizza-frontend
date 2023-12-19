"use client";

import { ThemeProvider } from "next-themes";
import ClientProviders from "./client-providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <ClientProviders>{children}</ClientProviders>
    </ThemeProvider>
  );
}
