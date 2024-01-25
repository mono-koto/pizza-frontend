"use client";

import AvatarStack from "@/components/avatar-stack";
import BlockscannerLink from "@/components/blockscanner-link";
import SplitterDonutChart from "@/components/splitter-donut-chart";
import { useSplitter } from "@/hooks/useSplitter";
import getConfig from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { getReleasedAndBalances } from "../actions";
import { Deposit } from "./deposit";
import { PayeeRow } from "./payee-row";
import { Release } from "./release";
import { ReleaseAll } from "./release-all";
import { TokenBalanceRow } from "./token-balance-row";
import SplitterTransfers from "./splitter-transfers";

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

  const totalShares = splitter.data.shares.reduce((a, b) => a + b, 0n);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row flex-wrap justify-between'>
        <div className='space-y-2'>
          <h2 className='text-3xl flex flex-row gap-2'>
            {splitter.data!.payees.length}-way Splitter
            <AvatarStack addresses={splitter.data!.payees} size={24} />
          </h2>
          <div className='text-muted-foreground text-sm'>
            <BlockscannerLink address={splitterAddr} kind='contract' short />{" "}
            <Link
              target='_blank'
              href={`https://pyusd.to/${splitterAddr}`}
              className='hover:underline'
            >
              View on PYUSD.to ↗
            </Link>
          </div>
        </div>
        <div className='flex justify-between gap-2'>
          <Deposit defaultToken={defaultToken} splitter={splitterAddr} />
          <ReleaseAll splitter={splitterAddr} tokens={releasable} />
        </div>
      </div>
      <SplitterDonutChart address={splitterAddr} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {releasedAndBalances.data && (
          <div className='flex flex-col gap-4'>
            <h4>Balances</h4>
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

        <div className='flex flex-col gap-4'>
          <h4>Payees</h4>
          {splitter.data.payees.map((payee, i) => (
            <PayeeRow
              key={i}
              address={payee}
              share={splitter.data.shares[i]}
              totalShares={totalShares}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h4>Transfers</h4>
        <SplitterTransfers address={splitterAddr} />
      </div>
    </div>
  );
}
