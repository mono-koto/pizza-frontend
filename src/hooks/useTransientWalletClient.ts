import { temporaryWalletClient } from "@/lib/wallet";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";

export const useTransientWalletClient = () => {
  const client = usePublicClient();
  return useMemo(() => {
    return temporaryWalletClient(client);
  }, [client]);
};
