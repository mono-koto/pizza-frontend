"use client";

import { useSplitter } from "@/hooks/useSplitter";
import { addressColors } from "@/lib/utils";
import { DonutChart } from "./donut-chart";
import { Address } from "viem";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEnsName } from "@wagmi/core";

export default function SplitterDonutChart({ address }: { address: Address }) {
  const splitterQuery = useSplitter({
    address,
  });

  const names = useQuery({
    queryKey: ["ens-names", splitterQuery.data?.payees],
    queryFn: async () => {
      return Promise.all(
        splitterQuery.data!.payees.map(async (payee) => {
          return fetchEnsName({ address: payee, chainId: 1 });
        })
      );
    },
    enabled: !!splitterQuery.data?.payees,
  });
  if (!splitterQuery.data) return null;
  const colors = addressColors(splitterQuery.data?.payees);

  return (
    <DonutChart
      labeled
      colors={colors}
      className='w-2/3 h-auto mx-auto'
      dataset={splitterQuery.data.shares.map((s, i) => ({
        id: splitterQuery.data.payees[i],
        name: names.data?.[i] || splitterQuery.data.payees[i],
        value: Number(s),
      }))}
    />
  );
}
