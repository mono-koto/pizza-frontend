import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useChainId, usePublicClient } from "wagmi";
import { useTransientWalletClient } from "./useTransientWalletClient";

export const useContractGasEstimate = (params: {
  address: Address;
  abi: any;
  functionName: string;
  args: any[];
}) => {
  const chainId = useChainId();
  const client = usePublicClient();
  const walletClient = useTransientWalletClient();

  return useQuery({
    queryKey: ["estimate-gas", walletClient, params.address, chainId],
    queryFn: async () => {
      const [gas, gasPrice] = await Promise.all([
        client.estimateContractGas({
          account: walletClient.account,
          ...params,
        }),
        0n,
      ]);
      return { gas, gasPrice };
    },
  });
};
