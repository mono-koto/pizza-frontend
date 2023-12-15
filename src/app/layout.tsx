import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Nav from "./components/nav";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>
          <div className='container mx-auto max-w-6xl'>
            <Nav className='mb-unit-sm' />

            <main className='p-6'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
