"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useTokenDetails } from "@/hooks/useTokenDetails";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Address } from "viem";

interface TokenButtonProps extends ButtonProps {
  address: Address;
}

export function TokenButton({ address, ...props }: TokenButtonProps) {
  const tokenDetails = useTokenDetails({ address });
  const className = props.className;
  delete props.className;
  return (
    <Button
      className={cn("rounded-full p-2 pr-3", className)}
      variant='outline'
      {...props}
    >
      {tokenDetails.isLoading ? (
        <div className='w-6 h-6 rounded-full bg-gray-200 animate-pulse'></div>
      ) : (
        <Image
          src={tokenDetails.data!.logo}
          className='mr-1.5 h-6 w-6 rounded-full'
          alt={`${tokenDetails.data!.symbol} Token Logo`}
          height={24}
          width={24}
        />
      )}
      {tokenDetails.data?.symbol}
    </Button>
  );
}
