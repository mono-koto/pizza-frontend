"use client";

import React from "react";

import { ThemeSwitcher } from "./theme-switcher";
import { Pizza } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Nav(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <div className='flex flex-row flex-wrap items-center justify-between mb-3 gap-4'>
        <div className='grow-0'>
          <Pizza />
        </div>
        <div className='flex-grow font-bold text-inherit text-xl'>
          SPLIT.PIZZA
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
