"use client";

import { Address } from "viem";

import useSplitterAssetTransfers from "@/hooks/useSplitterAssetTransfers";
import SplitterTransfer, { SplitterTransferHeader } from "./splitter-transfer";
import SplitterTransferRow from "./splitter-transfer";

export default function SplitterTransfers({ address }: { address: Address }) {
  const assetTransfers = useSplitterAssetTransfers({ address });

  return (
    <div className='grid grid-cols-4 gap-4 '>
      <SplitterTransferHeader />
      {assetTransfers.data?.map((t, i) => (
        <SplitterTransferRow key={i} transfer={t} splitterAddr={address} />
      ))}
    </div>
  );
}
