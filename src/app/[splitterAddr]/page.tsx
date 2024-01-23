"use client";

import AvatarStack from "@/components/avatar-stack";
import BlockscannerLink from "@/components/blockscanner-link";
import SplitterDonutChart from "@/components/splitter-donut-chart";
import { useSplitter } from "@/hooks/useSplitter";
import { symbolAddress } from "@/lib/tokens";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { Deposit } from "./_components/deposit";
import { Release } from "./_components/release";
import { TokenBalanceRow } from "./_components/token-balance-row";
import { getReleasedAndBalances } from "./actions";
import { ReleaseAll } from "./_components/release-all";
import useSplitterAssetTransfers from "@/hooks/useSplitterAssetTransfers";

export default function Splitter(props: {
  params: { splitterAddr: Address; chainId: string };
}) {
  const chainId = useChainId();

  if (!isAddress(props.params.splitterAddr)) {
    notFound();
  }

  const splitterAddr = props.params.splitterAddr;

  const splitter = useSplitter({ address: splitterAddr });

  const releasedAndBalances = useQuery({
    queryKey: ["releasedAndBalances", splitterAddr, chainId],
    queryFn: async () => {
      return getReleasedAndBalances({
        address: splitterAddr,
        chainId,
      });
    },
  });

  const transfers = useSplitterAssetTransfers({
    address: splitterAddr,
  });

  // console.log(transfers);

  const releasable =
    releasedAndBalances.data
      ?.filter((b) => b.balance > 0)
      .map((b) => b.address) || [];

  const defaultToken = symbolAddress("PYUSD", chainId);

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
