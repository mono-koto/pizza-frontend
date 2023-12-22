import type { Metadata } from "next";
import Nav from "../components/nav";
import "./globals.css";
import { Providers } from "../components/providers";

import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "split.pizza",
  description: "Split your PYUSD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className='p-4 mx-auto container max-w-6xl'>
            <Nav />
            <main className='mt-8'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
