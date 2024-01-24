"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

export function AboutDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className='cursor-pointer'>{content}</a>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>💡 About split.pizza</DialogTitle>
        </DialogHeader>
        <article className='prose prose-sm prose-slate dark:prose-invert'>
          <h4>Why did we build split.pizza?</h4>
          <p>
            We believe PYUSD can be a gateway to the crypto world for millions
            of people, and we want to help make that happen.
          </p>
          <p>
            PYUSD has the potential to be a fiat-backed stable{" "}
            <span className='italic'>for the people</span>, with the peg
            security of protocols like USDC, but accessible on/off-ramp
            liquidity available to millions of users.
          </p>
          <p></p>

          <h4>Is this an official PayPal product?</h4>
          <p>
            Most definitely not! This is a proof of concept app made by{" "}
            <a target='_blank' href='https://mono-koto.com/'>
              Mono Koto
            </a>{" "}
            and{" "}
            <a target='_blank' href='https://gardenlabs.xyz/'>
              Garden Labs
            </a>
            . PayPal doesn&apos;t endorse this app, and we aren't shilling
            PayPal! We just want to make it easier for normal people to get paid
            with crypto.
          </p>

          <h4>Who is in charge around here?</h4>
          <p>
            You are. The contracts have <strong>no owners</strong> and are{" "}
            <strong>immutable</strong>.
          </p>
          <p>
            That also means if you send tokens or ETH to any of these contracts,
            there's no way to rescue or undo it.
          </p>
          <p>
            This web app is just a frontend to the contracts, and was created by{" "}
            <a href='https://mono-koto.com/'>Mono Koto</a> in collaboration with{" "}
            <a href='https://gardenlabs.xyz/'>Garden Labs</a>. But if this web
            app someday disappears, your splitters and their deposited assets
            are still accessible via other means (e.g. Etherscan or whatever
            exists in the future).
          </p>
          <h4>How does this work?</h4>
          <p>
            When you create a Pizza (a splitter contract), you're sending a
            transaction to the PizzaFactory contract, which then makes a cheap
            and lightweight "clone" (actually a proxy) of a single main Pizza
            contract we've already deployed. That proxy contract address is what
            you can share with friends or collaborators to send PYUSD (or any
            other token) into.
          </p>
          <p>
            When you want to release funds, you send a transaction to that
            clone, which consults the underlying Pizza contract to figure out
            what to do. It then looks at all the payees and their portions, and
            sends them their share of the funds.
          </p>
          <h4>How was this built?</h4>
          <p>
            We used <a href='https://www.typescriptlang.org/'>Typescript</a>,{" "}
            <a href='https://nextjs.org/'>NextJS</a>,{" "}
            <a href='https://vercel.com/'>Vercel</a>,{" "}
            <a href='https://tailwindcss.com/'>TailwindCSS</a>,{" "}
            <a href='https://viem.sh/'>Viem</a>,{" "}
            <a href='https://wagmi.dev/'>Wagmi</a>,{" "}
            <a href='https://www.rainbowkit.com/'>RainbowKit</a>,{" "}
            <a href='https://ui.shadcn.com/'>ShadCN</a> +{" "}
            <a href='https://radix-ui.com/'>Radix</a>,{" "}
            <a href='https://github.com/mono-koto/pizza-frontend/blob/main/package.json'>
              and much more
            </a>
            .
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
