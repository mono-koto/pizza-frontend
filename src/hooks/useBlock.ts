import { useQuery } from "@tanstack/react-query";
import { useChainId, usePublicClient } from "wagmi";

export function useBlock(blockNumber: bigint | undefined) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: ["getBlock", blockNumber?.toString(), chainId],
    queryFn: async () => {
      return publicClient.getBlock({ blockNumber: blockNumber });
    },
    enabled: typeof blockNumber !== "undefined",
  });
}
