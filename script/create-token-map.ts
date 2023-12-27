import mainTokenList from "../src/tokens/uniswap.tokenlist.json";
import sepoliaTokenList from "../src/tokens/supplemental.tokenlist.json";

import tokenAllowList from "../src/tokens/token-allowlist.json";
import { sepolia, mainnet } from "viem/chains";

import preferredTokenOrder from "@/config/preferred-token-order.json";

const rawTokenList = [...mainTokenList.tokens, ...sepoliaTokenList.tokens];

function caseInsensitiveCompare(a: string, b: string) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

const result: {
  [chainId: number]: {
    tokens: {
      [address: string]: {
        name: string;
        symbol: string;
        decimals: number;
        logo: string;
        isNative?: boolean;
      };
    };
    symbols: {
      [symbol: string]: string;
    };
    preferredOrder: string[];
  };
} = {};

for (const token of rawTokenList) {
  if (token.chainId !== mainnet.id && token.chainId !== sepolia.id) {
    continue;
  }
  if (!tokenAllowList.includes(token.symbol)) {
    continue;
  }
  result[token.chainId] ||= { tokens: {}, symbols: {}, preferredOrder: [] };
  result[token.chainId].tokens[token.address.toLowerCase()] = {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: token.logoURI,
    isNative: Boolean((token as any).isNative),
  };
  result[token.chainId].symbols[token.symbol] = token.address.toLowerCase();
  result[token.chainId].preferredOrder.push(token.symbol);
}

const preferredReversed = [...preferredTokenOrder];

result[mainnet.id].preferredOrder = [
  ...preferredReversed.filter((symbol) =>
    result[mainnet.id].preferredOrder.includes(symbol)
  ),
  ...result[mainnet.id].preferredOrder
    .filter((symbol) => !preferredTokenOrder.includes(symbol))
    .sort(caseInsensitiveCompare),
];

result[sepolia.id].preferredOrder = [
  ...preferredReversed.filter((symbol) =>
    result[sepolia.id].preferredOrder.includes(symbol)
  ),
  ...result[sepolia.id].preferredOrder
    .filter((symbol) => !preferredTokenOrder.includes(symbol))
    .sort(caseInsensitiveCompare),
];

console.log(JSON.stringify(result, null, 2));
