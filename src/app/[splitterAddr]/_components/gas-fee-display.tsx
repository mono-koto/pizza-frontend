"use client";

import { formatTokenAmount } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface GasFeeDisplayProps {
  isLoading: boolean;
  gasAmount?: bigint;
  gasPrice?: bigint;
}

export function GasFeeDisplay({
  isLoading,
  gasAmount,
  gasPrice,
}: GasFeeDisplayProps) {
  return (
    <div className='h-4 text-slate-500'>
      {(() => {
        if (isLoading) {
          return (
            <span>
              <Skeleton className='inline-block h-4 w-[150px]' />
            </span>
          );
        }
        if (gasAmount === undefined || gasPrice === undefined) {
          return <span>+ network fee</span>;
        }

        return (
          <span className='flex flex-row items-center gap-0.5'>
            +{formatTokenAmount(gasAmount * gasPrice, 18)}
            <Image src='/ethereum-eth.svg' alt='ETH' height={16} width={16} />
          </span>
        );
      })()}
    </div>
  );
}
