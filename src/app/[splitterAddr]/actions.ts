"use server";

import ERC20ABI from "@/abi/ERC20.abi";
import PizzaAbi from "@/abi/Pizza.abi";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import getConfig from "@/lib/config";
import { createClient } from "@/lib/viemClient";
import { CreationInfo, Splitter } from "@/models";
import { revalidatePath } from "next/cache";
import { Address } from "viem";

export async function invalidateCache({ address }: { address: Address }) {
  revalidatePath(`/`, "layout");
}

export async function getReleasedAndBalances({
  chainId,
  address,
}: {
  chainId: number;
  address: Address;
}) {
  const tokensData = getConfig(chainId).tokens;
  const client = createClient(chainId);
  const tokenAddresses = tokensData.preferredOrder.map(
    (symbol) => tokensData.symbols[symbol as keyof typeof tokensData.symbols]
  ) as Address[];

  const erc20TokensOnly = tokenAddresses.filter(
    (addr) =>
      !tokensData.tokens[addr as keyof typeof tokensData.tokens].isNative
  );

  const [balance, totalReleased, tokenBalances] = await Promise.all([
    client.getBalance({ address }),
    client.readContract({
      abi: PizzaAbi,
      address,
      functionName: "totalReleased",
    }),
    client.multicall({
      contracts: erc20TokensOnly
        .map((tokenAddress) => [
          {
            abi: ERC20ABI,
            address: tokenAddress,
            functionName: "balanceOf",
            args: [address],
          },
          {
            abi: PizzaAbi,
            address,
            functionName: "erc20TotalReleased",
            args: [tokenAddress],
          },
        ])
        .flat(),
      allowFailure: false,
    }),
  ]);

  const ethIndex = tokensData.preferredOrder.indexOf("ETH");
  if (ethIndex < 0) {
    throw new Error("ETH not in preferred order");
  }

  tokenBalances.splice(ethIndex * 2, 0, balance, totalReleased);
  const tokenBalanceStates = tokenAddresses
    .map((address, index) => ({
      address,
      balance: tokenBalances[2 * index] as bigint,
      totalReleased: tokenBalances[2 * index + 1] as bigint,
      ...tokensData.tokens[address as keyof typeof tokensData.tokens],
    }))
    .filter(
      (token) =>
        token.balance > 0n ||
        token.totalReleased > 0n ||
        token.symbol === "PYUSD" ||
        token.symbol === "ETH"
    );

  return tokenBalanceStates as {
    address: Address;
    name?: string;
    symbol?: string;
    decimals?: number;
    logo?: string;
    balance: bigint;
  }[];
}

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

  const events = await client.getContractEvents({
    address: getConfig(chainId).factoryAddress,
    abi: PizzaFactoryAbi,
    eventName: "PizzaCreated",
    args: { pizza: address },
    fromBlock: getConfig(chainId).startBlock,
    strict: true,
  });

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
  const { payees, shares } = await getSplitterPayeesShares({
    chainId,
    address,
  });

  const { transactionHash, createdAt, creator } = await getSplitterCreation({
    chainId,
    address,
  });

  return {
    address,
    payees,
    shares,
    transactionHash,
    createdAt,
    creator,
  };
}
