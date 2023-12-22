"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { addressColors } from "@/lib/utils";
import { CreationInfo, Splitter, SplitterAssetState } from "@/models";
import Link from "next/link";
import { Address, formatUnits, isAddress } from "viem";
import { useChainId, useToken } from "wagmi";
import BlockscannerLink from "@/components/blockscanner-link";
import CustomAvatar from "@/components/custom-avatar";
import { DonutChart } from "@/components/donut-chart";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSplitter } from "./actions";
import { notFound } from "next/navigation";
import { alchemyClient } from "@/lib/alchemy";
import { Fragment, useMemo } from "react";
import Image from "next/image";
import getConfig from "@/lib/config";

export const revalidate = 60; // revalidate at most every minute

export default function Splitter(props: { params: { splitterAddr: Address } }) {
  if (!isAddress(props.params.splitterAddr)) {
    notFound();
  }

  const chainId = useChainId();

  const splitterQuery = useQuery({
    queryKey: ["splitter", props.params.splitterAddr, chainId],
    queryFn: async () => {
      return await getSplitter({
        address: props.params.splitterAddr,
        chainId: chainId,
      });
    },
    enabled: false,
  });

  const alchemy = useMemo(() => alchemyClient(chainId), [chainId]);
  const orderedAddresses = useMemo(() => {
    const config = getConfig(chainId);
    return config.tokens.preferredOrder.map(
      (symbol) =>
        config.tokens.symbols[symbol as keyof typeof config.tokens.symbols]
    );
  }, [chainId]);

  const balancesQuery = useInfiniteQuery({
    queryKey: ["splitter", props.params.splitterAddr, chainId],
    queryFn: async ({ pageParam = undefined }) => {
      return alchemy.core.getTokensForOwner(props.params.splitterAddr, {
        contractAddresses: orderedAddresses,
        pageKey: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.pageKey,
    enabled: isAddress(props.params.splitterAddr),
  });

  let decimals: number | undefined;
  let symbol: string | undefined;

  if (balancesQuery.data) {
    return (
      <>
        {balancesQuery.data.pages.map((page) => (
          <Fragment key={page.pageKey}>
            {page.tokens.map((b) => (
              <div key={b.contractAddress}>
                {b.logo && (
                  <Image
                    src={b.logo}
                    width={10}
                    height={10}
                    alt={b.symbol || b.name || b.contractAddress}
                  />
                )}
                {b.symbol} {b.balance}
              </div>
            ))}
          </Fragment>
        ))}
        <Button
          onClick={() => balancesQuery.fetchNextPage()}
          disabled={!balancesQuery.hasNextPage}
        >
          Next
        </Button>
      </>
    );
  }

  // if (balancesQuery.data?.pages[0]?.tokens[0]) {
  //   return (
  //     <>
  //       {balancesQuery.data.pages[0].tokens.map((b) => (
  //         <div key={b.contractAddress}>
  //           {b.logo && (
  //             <Image
  //               src={b.logo}
  //               width={10}
  //               height={10}
  //               alt={b.symbol || b.name || b.contractAddress}
  //             />
  //           )}
  //           {b.symbol} {b.balance}
  //         </div>
  //       ))}
  //     </>
  //   );
  // }

  if (!splitterQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Splitter</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Splitter: {props.params.splitterAddr}</p>
        </CardContent>
      </Card>
    );
  } else {
    const colors = addressColors(splitterQuery.data.payees);
    return (
      <div className='flex flex-row gap-4 text-xs splitter-list-item border border-border rounded-lg p-4 justify-stretch'>
        <div className=' self-start flex flex-col justify-center'>
          <DonutChart
            colors={colors}
            className='w-[100px] h-[100px] donut'
            dataset={splitterQuery.data.shares.map((s, i) => ({
              id: splitterQuery.data.payees[i],
              name: splitterQuery.data.payees[i],
              value: Number(s),
            }))}
          />
          <Button
            asChild
            size='sm'
            className='justify-self-stretch no-underline text-xs h-7'
            variant='ghost'
          >
            <Link href={`/${splitterQuery.data.address}`}>Details</Link>
          </Button>
        </div>
        <div className=' w-full space-y-2'>
          <div className='flex flex-row justify-between flex-wrap items-baseline'>
            <h3 className='text-2xl'>{splitterQuery.data.payees.length}-way</h3>
          </div>
          <p>
            <BlockscannerLink
              address={splitterQuery.data.address}
              kind='contract'
            />
          </p>

          <div>
            Created by{" "}
            <BlockscannerLink
              address={splitterQuery.data.creator}
              kind='address'
              ens
              short
            />
            on{" "}
            {new Date(
              Number(splitterQuery.data.createdAt) * 1000
            ).toLocaleString()}
          </div>

          <div className='flex flex-row items-center gap-1'>
            {splitterQuery.data.payees.length} Payees:
            <div className='ml-2 inline-block'>
              {splitterQuery.data.payees.map((p, i) => (
                <CustomAvatar
                  key={p}
                  address={p}
                  className='inline-block grow-0 w-4 h-4 -ml-2'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <Card>
  //     <CardHeader>
  //       <CardTitle>Splitter</CardTitle>
  //     </CardHeader>
  //     <CardContent>
  //       <p>Splitter: {props.params.splitter}</p>
  //     </CardContent>
  //   </Card>
  // );
}
