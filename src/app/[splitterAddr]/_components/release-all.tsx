"use client";

import PizzaAbi from "@/abi/Pizza.abi";
import { Button } from "@/components/ui/button";
import { isEthAddress } from "@/lib/tokens";
import { Loader2, PartyPopper, Pizza } from "lucide-react";
import { Address, encodeFunctionData } from "viem";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

interface ReleaseProps {
  splitter: Address;
  tokens: Address[];
}

export function ReleaseAll({ splitter, tokens }: ReleaseProps) {
  const prepareRelease = usePrepareContractWrite({
    abi: PizzaAbi,
    address: splitter,
    functionName: "multicall",
    args: [
      tokens.map((token) => {
        if (isEthAddress(token)) {
          return encodeFunctionData({
            abi: PizzaAbi,
            functionName: "release",
          });
        } else {
          return encodeFunctionData({
            abi: PizzaAbi,
            functionName: "erc20Release",
            args: [token],
          });
        }
      }),
    ],
    enabled: tokens.length > 0,
  });

  const release = useContractWrite(prepareRelease.config);

  const handleRelease = async () => {
    release.write?.();
  };

  return (
    <Button
      className='rounded-xl'
      variant={prepareRelease.isSuccess ? "default" : "outline"}
      onClick={handleRelease}
      disabled={!prepareRelease.isSuccess || release.isLoading}
    >
      {prepareRelease.isLoading || release.isLoading ? (
        <Loader2 className='animate animate-spin' />
      ) : (
        <>
          <PartyPopper className='w-4 h-4 mr-2' />
          Release All
        </>
      )}
    </Button>
  );
}
