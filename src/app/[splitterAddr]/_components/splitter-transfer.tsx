"use client";

import { Address } from "viem";

import BlockscannerLink from "@/components/blockscanner-link";
import { AssetTransfersResult } from "alchemy-sdk";
import { TokenImg } from "./token-img";
import { useTransaction } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlock } from "@/hooks/useBlock";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

export function SplitterTransferHeader() {
  return (
    <>
      <div className='text-sm text-left text-muted-foreground'>Kind</div>
      <div className='text-sm text-left text-muted-foreground'>Amount</div>
      <div className='text-sm text-left text-muted-foreground'>To/From</div>
      <div className='text-sm text-left text-muted-foreground'>When</div>
    </>
  );
}

export default function SplitterTransferRow({
  transfer,
  splitterAddr,
}: {
  transfer: AssetTransfersResult;
  splitterAddr: Address;
}) {
  const toSplitter = transfer.to?.toLowerCase() === splitterAddr.toLowerCase();

  const txn = useTransaction({
    hash: transfer.hash as `0x${string}`,
  });

  const block = useBlock(txn.data?.blockNumber);

  return (
    <>
      <div>
        {toSplitter ? (
          <Badge>Deposit</Badge>
        ) : (
          <Badge className='bg-blue-600 text-white hover:bg-blue-600 hover:text-white'>
            Release
          </Badge>
        )}
      </div>
      <div className='text-right'>
        <div className='flex flex-row gap-2'>
          <div>
            {transfer.value} {transfer.asset}
          </div>
          <TokenImg
            size={24}
            address={transfer.rawContract.address as Address | undefined}
          />
        </div>
      </div>
      <div>
        {toSplitter ? (
          <BlockscannerLink
            address={transfer.from as Address}
            kind='contract'
            short
            ens
          />
        ) : (
          <BlockscannerLink
            address={transfer.to as Address}
            kind='contract'
            short
            ens
          />
        )}
      </div>
      <div>
        {block.data ? (
          <BlockscannerLink
            address={transfer.hash}
            kind='transaction'
            short
            ens
          >
            {moment(new Date(Number(block.data.timestamp * 1000n))).fromNow()}
          </BlockscannerLink>
        ) : (
          <Skeleton className='w-full' />
        )}
      </div>
    </>
  );
}
