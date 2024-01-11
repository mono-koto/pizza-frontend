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

  // const isNative = releaseToken === undefined || isEthAddress(releaseToken);

  // const balance = useBalance({
  //   token: isNative ? undefined : releaseToken!,
  //   address: splitter,
  // });

  // console.log(releaseToken, balance.data?.formatted);

  // const prepareReleaseETH = usePrepareContractWrite({
  //   abi: PizzaAbi,
  //   address: splitter,
  //   functionName: "release",
  //   enabled: isNative,
  // });

  // const prepareReleaseERC20 = usePrepareContractWrite({
  //   abi: PizzaAbi,
  //   address: splitter,
  //   functionName: "erc20Release",
  //   args: [releaseToken!],
  //   enabled: !isNative,
  // });

  // const prepareRelease = isNative ? prepareReleaseETH : prepareReleaseERC20;

  // const release = useContractWrite(prepareRelease.config);

  // useWaitForTransaction({
  //   hash: release.data?.hash,
  //   onSuccess: () => {
  //     release.reset();
  //   },
  // });

  // const handleRelease = async () => {
  //   release.write?.();
  // };

  // console.log(releaseToken, ETH_ADDRESS);

  return (
    <Button
      className='rounded-xl'
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
