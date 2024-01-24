"use client";

import AvatarStack from "@/components/avatar-stack";
import BlockscannerLink from "@/components/blockscanner-link";
import SplitterDonutChart from "@/components/splitter-donut-chart";
import { useSplitter } from "@/hooks/useSplitter";
import useSplitterAssetTransfers from "@/hooks/useSplitterAssetTransfers";
import getConfig from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { getReleasedAndBalances } from "../actions";
import { Deposit } from "./deposit";
import { Release } from "./release";
import { ReleaseAll } from "./release-all";
import { TokenBalanceRow } from "./token-balance-row";

interface SplitterPageProps {
  splitterAddr: Address;
}

export default function Splitter(props: SplitterPageProps) {
  const chainId = useChainId();

  if (!isAddress(props.splitterAddr)) {
    notFound();
  }

  const splitterAddr = props.splitterAddr;

  const splitter = useSplitter({ address: splitterAddr });
  const releasedAndBalances = useQuery({
    queryKey: ["releasedAndBalances", splitterAddr, chainId],
    queryFn: async () => {
      return getReleasedAndBalances({
        address: splitterAddr,
        chainId,
      });
    },
    enabled: splitter.isSuccess,
  });
  if (splitter.error?.toString().match(/The address is not a contract/gi)) {
    console.log("not a contract");
    notFound();
  }

  const releasable =
    releasedAndBalances.data
      ?.filter((b) => b.balance > 0)
      .map((b) => b.address) || [];

  const defaultToken = getConfig(chainId).preferredToken;

  if (!defaultToken) {
    throw new Error("No default token found");
  }

  if (!splitter.data) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-3xl'>
          {splitter.data!.payees.length}-way Splitter
        </h2>
        <BlockscannerLink address={splitterAddr} kind='contract' />
        <div>
          <Link
            target='_blank'
            href={`https://pyusd.to/${splitterAddr}`}
            className='hover:underline'
          >
            View on PYUSD.to ↗
          </Link>
        </div>
        <AvatarStack addresses={splitter.data!.payees} size={32} />
      </div>
      <SplitterDonutChart address={splitterAddr} />

      <div className='flex justify-between'>
        <Deposit defaultToken={defaultToken} splitter={splitterAddr} />
        <ReleaseAll splitter={splitterAddr} tokens={releasable} />
      </div>
      {releasedAndBalances.data && (
        <div className='flex flex-col gap-4'>
          {releasedAndBalances.data!.map((b, i) => (
            <TokenBalanceRow
              key={i}
              releaseButton={
                <Release splitter={splitterAddr} releaseToken={b.address} />
              }
              token={{
                balance: b.balance,
                decimals: b.decimals,
                logoURI: b.logo,
                symbol: b.symbol,
                name: b.name,
                address: b.address,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
