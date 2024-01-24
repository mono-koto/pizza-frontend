import type { Metadata } from "next";
import Nav from "../components/nav";
import "./globals.css";
import { Providers } from "../components/providers";

import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Footer from "@/components/footer";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "PYUSD.pizza",
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
          " bg-background font-sans antialiased min-h-screen",
          fontSans.variable
        )}
      >
        <Providers>
          <div className='flex flex-col min-h-screen justify-stretch gap-4 p-3 md:p-6 mx-auto container max-w-6xl'>
            <Nav />
            <main className='mt-8 flex-1'>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
