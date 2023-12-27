"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Address, isAddress } from "viem";
import { useChainId } from "wagmi";

import { alchemyClient } from "@/lib/alchemy";
import { notFound } from "next/navigation";
import { Fragment, useMemo } from "react";
import { TokenBalanceRow } from "./token-balance-row";
import getConfig from "@/lib/config";

export const revalidate = 60; // revalidate at most every minute

export default function TokenBalancesList({ address }: { address: Address }) {
  if (!isAddress(address)) {
    notFound();
  }

  const chainId = useChainId();

  const alchemy = useMemo(() => alchemyClient(chainId), [chainId]);

  const balancesQuery = useInfiniteQuery({
    queryKey: ["token-balances-list", address, chainId],
    queryFn: async ({ pageParam = undefined }) => {
      return alchemy.core.getTokensForOwner(address, {
        contractAddresses: Object.values(getConfig(chainId).tokens.symbols),
        pageKey: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.pageKey,
    enabled: isAddress(address),
  });

  if (balancesQuery.isError) {
    return <div>Error: {balancesQuery.error?.toLocaleString()}</div>;
  }

  if (balancesQuery.data) {
    return (
      <>
        {balancesQuery.data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.tokens
              .filter((t) => t.rawBalance !== "0")
              .map((b, i) => (
                <div key={`${index}-${i}`}>
                  <TokenBalanceRow
                    token={{
                      balance: b.balance || "0",
                      decimals: b.decimals,
                      // rawBalance: b.rawBalance || "0",
                      logoURI: b.logo,
                      symbol: b.symbol,
                      name: b.name,
                      address: b.contractAddress as Address,
                    }}
                  />
                </div>
              ))}
          </Fragment>
        ))}

        {balancesQuery.hasNextPage && (
          <Button onClick={() => balancesQuery.fetchNextPage()}>Next</Button>
        )}
      </>
    );
  }
}
