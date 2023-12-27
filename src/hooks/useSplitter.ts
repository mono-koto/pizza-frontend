import { getSplitter } from "@/app/[chainId]/[splitterAddr]/actions";
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
  });
};
