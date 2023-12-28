import AvatarStack from "@/components/avatar-stack";
import BlockscannerLink from "@/components/blockscanner-link";
import SplitterDonutChart from "@/components/splitter-donut-chart";
import {
  defaultTokenAddress,
  orderedTokens,
  symbolAddress,
} from "@/lib/tokens";
import { notFound } from "next/navigation";
import { Address, formatUnits, isAddress } from "viem";
import { Deposit } from "./_components/deposit";
import { TokenBalanceRow } from "./_components/token-balance-row";
import { getReleasedAndBalances, getSplitter } from "./actions";
import Link from "next/link";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Splitter(props: {
  params: { splitterAddr: Address; chainId: string };
}) {
  const chainId = parseInt(props.params.chainId);

  if (!isAddress(props.params.splitterAddr) || isNaN(chainId)) {
    notFound();
  }

  const splitterAddr = props.params.splitterAddr;

  const splitter = await getSplitter({
    address: props.params.splitterAddr,
    chainId,
  });

  const releasedAndBalances = await getReleasedAndBalances({
    address: props.params.splitterAddr,
    chainId,
  });

  const defaultToken = symbolAddress("USDC", chainId);

  if (!defaultToken) {
    throw new Error("No default token found");
  }

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-3xl'>{splitter.payees.length}-way Splitter</h2>
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
        <AvatarStack addresses={splitter.payees} size={32} />
      </div>
      <SplitterDonutChart address={splitterAddr} />

      <div>
        <Deposit defaultToken={defaultToken} splitter={splitterAddr} />
      </div>
      <div className='flex flex-col gap-4'>
        {releasedAndBalances.map((b, i) => (
          <TokenBalanceRow
            key={i}
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
    </div>
  );
}
