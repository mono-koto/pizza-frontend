"use server";

import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import getConfig from "@/lib/config";
import { createClient } from "@/lib/viemClient";
import { CreationInfo, Splitter, SplitterAssetState } from "@/models";
import { Address } from "viem";
import {
  getSplitterPayeesShares,
  getSplitterState,
} from "./[splitterAddr]/actions";

type SplitterCreation = Splitter & SplitterAssetState & CreationInfo;

export const revalidate = 60; // revalidate at most every minute

export async function getRecentSplitterCreations({
  chainId,
  token,
}: {
  chainId: number;
  token?: Address;
}): Promise<SplitterCreation[]> {
  const client = createClient(chainId);

  const filter = await client.createContractEventFilter({
    address: getConfig(chainId).factoryAddress,
    abi: PizzaFactoryAbi,
    eventName: "PizzaCreated",
    fromBlock: getConfig(chainId).startBlock,
  });

  const events = (await client.getFilterLogs({ filter }))
    .reverse()
    .slice(0, 10);

  return await Promise.all(
    events.map(async (event) => {
      const address = event.args.pizza;
      if (!address) {
        throw new Error("No address");
      }

      const creator = event.args.creator;
      if (!address) {
        throw new Error("No creator");
      }

      const [
        { payees, shares },
        { balance, totalReleased },
        block,
        txnReceipt,
      ] = await Promise.all([
        getSplitterPayeesShares({
          chainId,
          address,
        }),
        getSplitterState({
          chainId,
          address,
          token,
        }),
        client.getBlock({ blockNumber: event.blockNumber }),
        client.getTransactionReceipt({ hash: event.transactionHash }),
      ]);

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
