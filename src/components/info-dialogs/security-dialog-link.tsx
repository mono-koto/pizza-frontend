"use client";

import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import getConfig from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useChainId, useContractRead } from "wagmi";
import BlockscannerLink from "../blockscanner-link";

export function SecurityDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  const chainId = useChainId();
  const { factoryAddress } = getConfig(chainId);
  const implementation = useContractRead({
    abi: PizzaFactoryAbi,
    address: factoryAddress,
    functionName: "implementation",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className='cursor-pointer'>{content}</a>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Security + Safety</DialogTitle>
        </DialogHeader>
        <article className='prose prose-slate dark:prose-invert prose-sm'>
          <h4>Has this app been audited or reviewed?</h4>
          <p>
            No. This app is a proof of concept only. It has not been audited or
            reviewed by security researchers. The contracts have not been
            audited either.
          </p>

          <h4>What are the contract addresses?</h4>
          <ul>
            <li>
              PizzaFactory:{" "}
              <BlockscannerLink
                address={getConfig(1).factoryAddress}
                kind='contract'
              />
            </li>
            {implementation.data && (
              <li>
                Pizza (implementation):{" "}
                <BlockscannerLink
                  address={implementation.data}
                  kind='contract'
                />
              </li>
            )}
          </ul>

          <h4>
            What happens if I incur losses using this app or the related smart
            contracts?
          </h4>
          <p>
            This app and its creators take no legal or financial responsibility
            for any losses incurred for any reason. Do your own research and use
            at your own risk.
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
