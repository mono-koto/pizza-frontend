import { getSplitter } from "@/app/[splitterAddr]/actions";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useChainId } from "wagmi";

export const useSplitter = ({ address }: { address: Address }) => {
  const chainId = useChainId();

  return useQuery({
    queryKey: ["getSplitter", address, chainId],
    queryFn: async () => {
      return await getSplitter({
        address,
        chainId,
      });
    },
    retry: false,
  });
};
