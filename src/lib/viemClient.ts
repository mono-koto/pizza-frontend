import { extractChain, http, createPublicClient } from "viem";
import { Chain, localhost, mainnet, sepolia } from "viem/chains";

function rpc(chain: Chain) {
  switch (chain) {
    case sepolia:
      return `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    case localhost:
      return "http://localhost:8545";
    case mainnet:
      return `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  }
}

export function createClient(chainId: number) {
  let chain = extractChain({
    chains: [mainnet, sepolia, localhost],
    id: chainId as any, // hack for type conflict
  });

  const transport = http(rpc(chain));

  return createPublicClient({
    chain: chain === localhost ? mainnet : chain, /// hack: assume localhost is mainnet
    transport,
  });
}
