import ERC20ABI from "@/abi/ERC20.abi";
import PizzaAbi from "@/abi/Pizza.abi";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import getConfig from "@/lib/config";
import { createClient } from "@/lib/viemClient";
import { CreationInfo, Splitter } from "@/models";
import { Address } from "viem";

export async function getSplitterState({
  chainId,
  address,
  token,
}: {
  chainId: number;
  address: Address;
  token?: Address;
}) {
  const client = createClient(chainId);

  let balance: bigint, totalReleased: bigint;
  if (token) {
    [balance, totalReleased] = await client.multicall({
      contracts: [
        {
          abi: ERC20ABI,
          address: token!,
          functionName: "balanceOf",
          args: [address],
        },
        {
          abi: PizzaAbi,
          address,
          functionName: "erc20TotalReleased",
          args: [address],
        },
      ],
      allowFailure: false,
    });
  } else {
    [balance, totalReleased] = await Promise.all([
      client.getBalance({ address }),
      client.readContract({
        abi: PizzaAbi,
        address,
        functionName: "totalReleased",
      }),
    ]);
  }
  return {
    balance,
    totalReleased,
  };
}

export async function getSplitterPayeesShares({
  chainId,
  address,
}: {
  chainId: number;
  address: Address;
}) {
  const client = createClient(chainId);

  const payees = await client.readContract({
    abi: PizzaAbi,
    address,
    functionName: "payees",
  });
  const shares = await client.multicall({
    contracts: payees.map((payee) => ({
      abi: PizzaAbi,
      address,
      functionName: "shares",
      args: [payee],
    })),
    allowFailure: false,
  });

  return {
    payees,
    shares,
  };
}

export async function getSplitterCreation({
  chainId,
  address,
}: {
  chainId: number;
  address: Address;
}) {
  const client = createClient(chainId);

  const filter = await client.createContractEventFilter({
    address: getConfig(chainId).factoryAddress,
    abi: PizzaFactoryAbi,
    eventName: "PizzaCreated",
    args: { pizza: address },
    fromBlock: 18830000n,
  });

  const events = await client.getFilterLogs({ filter });
  if (events.length === 0) {
    throw new Error("No creation event");
  }
  const hash = events[0].transactionHash;

  return {
    transactionHash: hash,
    createdAt: (await client.getBlock({ blockNumber: events[0].blockNumber }))
      .timestamp,
    creator: (
      await client.getTransactionReceipt({
        hash: hash,
      })
    ).from,
  };
}

export async function getSplitter({
  chainId,
  address,
}: {
  chainId: number;
  address: Address;
}): Promise<Splitter & CreationInfo> {
  const [{ payees, shares }, { transactionHash, createdAt, creator }] =
    await Promise.all([
      getSplitterPayeesShares({
        chainId,
        address,
      }),
      getSplitterCreation({
        chainId,
        address,
      }),
    ]);

  return {
    address,
    payees,
    shares,
    transactionHash,
    createdAt,
    creator,
  };
}
