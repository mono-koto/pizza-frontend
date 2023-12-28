import { alchemyClient } from "@/lib/alchemy";
import { useMemo } from "react";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export default function useTokenBalances({
  address,
}: {
  address: Address | undefined;
}) {
  const chainId = useChainId();
  const alchemy = useMemo(() => alchemyClient(chainId), [chainId]);

  return useQuery({
    queryKey: ["token-balance", address, chainId],
    queryFn: async () => {
      const balances = await alchemy.core.getTokenBalances(address!);
      return {
        ...balances,
        tokenBalances: balances.tokenBalances.filter(
          (b) => b.tokenBalance && BigInt(b.tokenBalance) > 0n
        ),
      };
    },
    enabled: address && isAddress(address),
  });
}
