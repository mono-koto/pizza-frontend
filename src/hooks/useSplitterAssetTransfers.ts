import { alchemyClient } from "@/lib/alchemy";
import { useMemo } from "react";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getSplitterAssetTransfers } from "@/lib/splitter";

export default function useSplitterAssetTransfers({
  address,
}: {
  address: Address | undefined;
}) {
  const chainId = useChainId();

  return useQuery({
    queryKey: ["getSplitterAssetTransfers", address, chainId],
    queryFn: async () => {
      return getSplitterAssetTransfers({
        address: address!,
        chainId,
      });
    },
    enabled: address && isAddress(address),
  });
}
