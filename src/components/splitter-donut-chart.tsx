"use client";

import { useSplitter } from "@/hooks/useSplitter";
import { addressColors } from "@/lib/utils";
import { DonutChart } from "./donut-chart";
import { Address } from "viem";

export default function SplitterDonutChart({ address }: { address: Address }) {
  const splitterQuery = useSplitter({
    address,
  });
  if (!splitterQuery.data) return null;

  const colors = addressColors(splitterQuery.data.payees);
  return (
    <DonutChart
      labeled
      colors={colors}
      className='w-2/3 h-auto mx-auto'
      dataset={splitterQuery.data.shares.map((s, i) => ({
        id: splitterQuery.data.payees[i],
        name: splitterQuery.data.payees[i],
        value: Number(s),
      }))}
    />
  );
}
