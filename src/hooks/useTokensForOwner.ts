import { alchemyClient } from "@/lib/alchemy";
import getConfig from "@/lib/config";
import { useMemo } from "react";
import { Address, isAddress } from "viem";
import { useChainId, useInfiniteQuery } from "wagmi";

export default function useTokensForOwner({
  address,
}: {
  address: Address | undefined;
}) {
  const chainId = useChainId();

  const alchemy = useMemo(() => alchemyClient(chainId), [chainId]);

  return useInfiniteQuery({
    queryKey: ["tokens-for-owner", address, chainId],
    queryFn: async ({ pageParam = undefined }) => {
      return alchemy.core.getTokensForOwner(address!, {
        contractAddresses: Object.values(getConfig(chainId).tokens.symbols),
        pageKey: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.pageKey,
    enabled: address && isAddress(address),
  });
}
