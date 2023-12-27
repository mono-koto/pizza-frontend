import { notFound } from "next/navigation";
import { Address, formatUnits, isAddress } from "viem";
import { getReleasedAndBalances, getSplitter } from "./actions";
import SplitterDonutChart from "@/components/splitter-donut-chart";
import BlockscannerLink from "@/components/blockscanner-link";
import AvatarStack from "@/components/avatar-stack";
import { TokenBalanceRow } from "./_components/token-balance-row";
import { Button } from "@/components/ui/button";

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

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-3xl'>{splitter.payees.length}-way Splitter</h2>
        <BlockscannerLink address={splitterAddr} kind='contract' />
        <AvatarStack addresses={splitter.payees} size={32} />
      </div>
      <SplitterDonutChart address={splitterAddr} />

      <div>
        <Button>Deposit</Button>
      </div>
      <div className='flex flex-col gap-4'>
        {releasedAndBalances.map((b, i) => (
          <TokenBalanceRow
            key={i}
            token={{
              balance: formatUnits(b.balance, b.decimals || 18),
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
