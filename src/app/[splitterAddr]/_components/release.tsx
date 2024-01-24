"use client";

import PizzaAbi from "@/abi/Pizza.abi";
import { Button } from "@/components/ui/button";
import { ETH_ADDRESS } from "@/config/config";
import { isEthAddress } from "@/lib/tokens";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import {
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { invalidateCache } from "../actions";

interface ReleaseProps {
  splitter: Address;
  releaseToken?: Address;
}

export function Release({ splitter, releaseToken }: ReleaseProps) {
  const isNative = releaseToken === undefined || isEthAddress(releaseToken);

  const router = useRouter();

  const balance = useBalance({
    token: isNative ? undefined : releaseToken!,
    address: splitter,
  });

  const prepareReleaseETH = usePrepareContractWrite({
    abi: PizzaAbi,
    address: splitter,
    functionName: "release",
    enabled: isNative,
  });

  const prepareReleaseERC20 = usePrepareContractWrite({
    abi: PizzaAbi,
    address: splitter,
    functionName: "erc20Release",
    args: [releaseToken!],
    enabled: !isNative,
  });

  const prepareRelease = isNative ? prepareReleaseETH : prepareReleaseERC20;

  const release = useContractWrite(prepareRelease.config);

  useWaitForTransaction({
    hash: release.data?.hash,
    onSuccess: async () => {
      release.reset();
      await invalidateCache({ address: splitter });
      router.refresh();
    },
  });

  const handleRelease = async () => {
    release.write?.();
  };

  return (
    <Button
      size='sm'
      className='p-2 text-xs leading-tight h-fit'
      variant='secondary'
      onClick={handleRelease}
      disabled={!prepareRelease.isSuccess || release.isLoading}
    >
      {prepareRelease.isLoading || release.isLoading ? (
        <Loader2 className='animate animate-spin' />
      ) : (
        "Release"
      )}
    </Button>
  );
}
