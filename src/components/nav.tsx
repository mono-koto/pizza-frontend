"use client";

import React from "react";

import { Pizza } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(() => import("./theme-switcher"), {
  ssr: false,
});

export default function Nav(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <div className='flex flex-row flex-wrap items-center justify-between mb-3 gap-4'>
        <div className='grow-0'>
          <Link href='/'>
            <Pizza />
          </Link>
        </div>
        <div className='flex-grow font-bold text-inherit text-xl'>
          <Link href='/'>SPLIT.PIZZA</Link>
        </div>
        <div className='min-h-12'>
          <ConnectButton label='Connect' />
        </div>
        <div className='min-h-12'>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
