import mainTokenList from "../src/tokens/uniswap.tokenlist.json";
import sepoliaTokenList from "../src/tokens/sepolia.tokenlist.json";

import { sepolia, mainnet } from "viem/chains";

import { preferredTokenSymbols } from "@/config";

const rawTokenList = [...mainTokenList.tokens, ...sepoliaTokenList.tokens];

const result: {
  [chainId: number]: {
    tokens: {
      [address: string]: {
        name: string;
        symbol: string;
        decimals: number;
        logo: string;
      };
    };
    symbols: {
      [symbol: string]: string;
    };
    preferredOrder: string[];
  };
  hostNames: string[];
} = {
  hostNames: [],
};

const hostnames = new Set<string>();

for (const token of rawTokenList) {
  if (token.chainId !== mainnet.id && token.chainId !== sepolia.id) {
    // console.log("skipping", token.symbol, token.chainId);
    continue;
  }
  result[token.chainId] ||= { tokens: {}, symbols: {}, preferredOrder: [] };
  result[token.chainId].tokens[token.address] = {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: token.logoURI,
  };
  result[token.chainId].symbols[token.symbol] = token.address;
  result[token.chainId].preferredOrder.push(token.symbol);

  hostnames.add(new URL(token.logoURI).hostname);
}

const preferredReversed = [...preferredTokenSymbols];

result[mainnet.id].preferredOrder = [
  ...preferredReversed.filter((symbol) =>
    result[mainnet.id].preferredOrder.includes(symbol)
  ),
  ...result[mainnet.id].preferredOrder
    .filter((symbol) => !preferredTokenSymbols.includes(symbol))
    .sort(),
];

result[sepolia.id].preferredOrder = [
  ...preferredReversed.filter((symbol) =>
    result[sepolia.id].preferredOrder.includes(symbol)
  ),
  ...result[sepolia.id].preferredOrder
    .filter((symbol) => !preferredTokenSymbols.includes(symbol))
    .sort(),
];

result.hostNames = [...hostnames];
// console.log(`export default ${JSON.stringify(result, null, 2)} as const;`);
console.log(JSON.stringify(result, null, 2));
