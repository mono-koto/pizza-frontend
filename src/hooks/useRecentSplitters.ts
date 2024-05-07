import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import {
  getSplitterPayeesShares,
  getSplitterState,
} from "@/app/[splitterAddr]/actions";
import getConfig from "@/lib/config";
import { CreationInfo, Splitter, SplitterAssetState } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { PublicClient, usePublicClient } from "wagmi";

type SplitterCreation = Splitter & SplitterAssetState & CreationInfo;

export function useRecentSplitters({ token }: { token?: Address } = {}) {
  const client = usePublicClient();
  return useQuery({
    queryKey: ["getRecentSplitters", token, client.chain.id],
    queryFn: async () => {
      return getRecentSplitterCreations({
        token,
        client,
      });
    },
  });
}

async function getRecentSplitterCreations({
  token,
  client,
}: {
  token?: Address;
  client: PublicClient;
}): Promise<SplitterCreation[]> {
  const events = await client.getContractEvents({
    address: getConfig(client.chain.id).factoryAddress,
    abi: PizzaFactoryAbi,
    eventName: "PizzaCreated",
    fromBlock: getConfig(client.chain.id).startBlock,
    strict: true,
  });

  return await Promise.all(
    events
      .reverse()
      .slice(0, 10)
      .map(async (event) => {
        const address = event.args.pizza;
        if (!address) {
          throw new Error("No address");
        }

        const { payees, shares } = await getSplitterPayeesShares({
          chainId: client.chain.id,
          address,
        });

        const { balance, totalReleased } = await getSplitterState({
          chainId: client.chain.id,
          address,
          token,
        });

        const block = await client.getBlock({ blockNumber: event.blockNumber });
        const txnReceipt = await client.getTransactionReceipt({
          hash: event.transactionHash,
        });

        return {
          address,
          payees,
          shares,
          token,
          balance,
          totalReleased,
          transactionHash: event.transactionHash,
          createdAt: block.timestamp,
          creator: txnReceipt.from,
        };
      })
  );
}
