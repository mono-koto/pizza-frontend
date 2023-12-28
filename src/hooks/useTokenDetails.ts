import getConfig from "@/lib/config";
import { TokenDetails } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { fetchToken } from "@wagmi/core";
import { orderedTokens } from "@/lib/tokens";
import { isURL } from "@/lib/utils";
import { alchemyClient } from "@/lib/alchemy";

export function backupTokenUri(address: Address) {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

export function useTokenMap() {
  const chainId = useChainId();
  const tokenData = getConfig(chainId).tokens;
  const tokenMap = useMemo(
    () =>
      new Map<Address, TokenDetails>(
        Object.entries(tokenData.tokens) as [Address, TokenDetails][]
      ),
    [tokenData]
  );

  return tokenMap;
}

export function useOrderedTokens() {
  const chainId = useChainId();
  return useMemo(() => orderedTokens(chainId), [chainId]);
}

/// Consult local token list details before going out to network
export function useTokenDetails(
  props: { address?: Address } | { symbol?: string }
) {
  const chainId = useChainId();
  const tokenMap = useTokenMap();

  const tokenData = getConfig(chainId).tokens;

  const address =
    (props as { address?: Address }).address ||
    (tokenData.symbols[
      (props as { symbol?: string }).symbol as keyof typeof tokenData.symbols
    ] as Address);

  return useQuery({
    queryKey: ["tokenDetails", chainId, address],
    queryFn: async (): Promise<TokenDetails> => {
      const token = address && tokenMap.get(address.toLowerCase() as Address);

      if (token) {
        console.debug("found in local list", token.symbol, token.name);
        return (
          token && {
            ...token,
            chainId,
            logo: token.logo.length ? token.logo : backupTokenUri(address),
          }
        );
      }

      const fetched = await alchemyClient(chainId).core.getTokenMetadata(
        address
      );
      if (!fetched.logo) {
        // no logo means not a token worth returning
        throw new Error("Not found");
      }

      return {
        address,
        name: fetched.name || "",
        symbol: fetched.symbol || "",
        decimals: fetched.decimals || 0,
        chainId,
        logo: fetched.logo || backupTokenUri(address),
      };
    },
    enabled: Boolean(address),
    retry: false,
    staleTime: Infinity,
  });
}
