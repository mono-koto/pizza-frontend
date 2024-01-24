"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
// import { PersonalizeButton } from "../personalize-button";

export function PayPalDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className='cursor-pointer'>{content}</a>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Hello PayPal friend!</DialogTitle>
          <DialogDescription>
            So you want to split some funds among friends? Or maybe frenemies?
            Either way, this app is for you.
          </DialogDescription>
        </DialogHeader>
        <article className='prose prose-sm prose-slate dark:prose-invert'>
          <h4>What is PYUSD?</h4>
          <p>
            PYUSD is a token that lives on the Ethereum blockchain. It is pegged
            to the US Dollar, so 1 PYUSD = 1 USD.
          </p>

          <h4>How do I create a splitter?</h4>
          <p>
            If you want to create your own splitter, you'll need to fund a
            wallet with some ETH, which is the native currency of Ethereum.
          </p>

          <p>If you don't have a wallet, take a look at:</p>
          <ul>
            <li>
              <Link href='https://metamask.io/' target='_blank'>
                MetaMask
              </Link>{" "}
              (which has a PayPal integration)
            </li>
            <li>
              <Link href='https://rainbow.me/' target='_blank'>
                Rainbow
              </Link>{" "}
            </li>
            <li>
              <Link href='https://www.coinbase.com/wallet'>
                Coinbase Wallet
              </Link>
            </li>
          </ul>

          <p>
            Each wallet has a different flow for buying ETH. MetaMask even lets
            you Pay with PayPal. You can also{" "}
            <Link href='https://www.paypal.com/us/digital-wallet/manage-money/crypto'>
              buy ETH via the PayPal app
            </Link>{" "}
            and{" "}
            <Link href='https://www.paypal.com/us/cshelp/article/how-do-i-transfer-my-crypto-help822'>
              send it over to your wallet
            </Link>
            !
          </p>

          <p>
            (there's also a "gasless" way of creating a splitter by letting
            other people do the transactions for you for a bounty, and our
            contracts support it, but we haven't yet exposed it in this UX)
          </p>

          <h4>How do I find receive PYUSD from a splitter</h4>
          <p>
            If you have a PayPal account, you can get a PYUSD wallet address by
            following the{" "}
            <Link
              href='https://www.paypal.com/us/cshelp/article/how-do-i-transfer-my-crypto-HELP822'
              target='_blank'
            >
              steps for receiving crypto in your PayPal account
            </Link>
            :
          </p>
          <ol>
            <li>
              Go to the{" "}
              <Link
                href='https://www.paypal.com/myaccount/crypto/'
                target='_blank'
              >
                Finances tab
              </Link>
              .
            </li>
            <li>Tap your crypto balance.</li>
            <li>
              Tap the image Transfer arrows:{" "}
              <Image
                className='m-0 inline-block'
                src='https://www.paypalobjects.com/gops/crypto_transfer_arrows.png'
                width={24}
                height={24}
                alt='Transfer Arrows'
              />
            </li>
            <li>Tap Receive.</li>
            <li>Select PYUSD.</li>
            <li>Your QR code & PYUSD receiving address will appear.</li>
            <li>Copy the address.</li>
          </ol>
          <p>
            When creating a splitter, paste that PYUSD receiving address into
            one of the recipient fields (or you can use the nickname you created
            via <Link href='https://PYUSD.to'>PYUSD.to</Link>)
          </p>

          <h4>What are the fees for this?</h4>
          <p>
            This website doesn&apos;t charge any fees! But when people pay you,
            there will be a few costs:
          </p>
          <ul>
            <li>Gas fees for the Ethereum network</li>
            <li>
              "Bounty" fees paid out to whoever does the release for you. This
              is not enabled by default.
            </li>
          </ul>

          <p>
            The exact USD value of such fees also depends on the current
            asset:USD exchange rate at the time.
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
