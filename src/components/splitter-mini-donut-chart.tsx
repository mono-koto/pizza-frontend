"use client";

import { useSplitter } from "@/hooks/useSplitter";
import { addressColors } from "@/lib/utils";
import { DonutChart } from "./donut-chart";
import { Address } from "viem";
import useIsDark from "@/hooks/useIsDark";

export default function SplitterMiniDonutChart({
  address,
}: {
  address: Address;
}) {
  const splitterQuery = useSplitter({
    address,
  });
  if (!splitterQuery.data) return null;

  const colors = addressColors(splitterQuery.data.payees);

  return (
    <DonutChart
      colors={colors}
      className='w-[100px] h-[100px] donut'
      dataset={splitterQuery.data.shares.map((s, i) => ({
        id: splitterQuery.data.payees[i],
        name: splitterQuery.data.payees[i],
        value: Number(s),
      }))}
    />
  );
}
