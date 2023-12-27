import getConfig from "@/lib/config";
import { TokenDetails } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { fetchToken } from "@wagmi/core";

export function backupTokenUri(address: Address) {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

export function useTokenMap() {
  const chainId = useChainId();
  const tokenList = getConfig(chainId).tokens;
  const tokenMap = useMemo(
    () =>
      new Map<Address, TokenDetails>(
        Object.entries(tokenList) as [Address, TokenDetails][]
      ),
    [tokenList]
  );

  return tokenMap;
}

/// Consult local token list details before going out to network
export function useTokenDetails(address?: Address) {
  const chainId = useChainId();
  const tokenMap = useTokenMap();

  return useQuery({
    queryKey: ["tokenDetails", chainId, address],
    queryFn: async () => {
      const fetched = await fetchToken({
        address: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
      });
      return {
        ...fetched,
        chainId,
        logoURI: address ? backupTokenUri(address) : "",
      } as TokenDetails;
    },
    initialData: address && tokenMap.get(address.toLowerCase() as Address),
    staleTime: Infinity,
  });
}
