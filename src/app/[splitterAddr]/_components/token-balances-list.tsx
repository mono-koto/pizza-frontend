"use client";

import { Button } from "@/components/ui/button";
import { Address, isAddress } from "viem";

import { notFound } from "next/navigation";
import { Fragment } from "react";
import { TokenBalanceRow } from "./token-balance-row";
import useTokensForOwner from "@/hooks/useTokensForOwner";

export default function TokenBalancesList({ address }: { address: Address }) {
  if (!isAddress(address)) {
    notFound();
  }

  const balancesQuery = useTokensForOwner({ address });

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
                      balance: b.rawBalance ? BigInt(b.rawBalance) : 0n,
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
