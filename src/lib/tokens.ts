import { Address } from "viem";
import getConfig from "./config";
import { TokenDetails } from "@/models";
import { ETH_ADDRESS_REGEX } from "@/config/config";

export function symbolAddress(symbol: string, chainId: number) {
  const tokenData = getConfig(chainId).tokens;
  return tokenData.symbols[symbol as keyof typeof tokenData.symbols] as
    | Address
    | undefined;
}

export function symbolTokenDetails(symbol: string, chainId: number) {
  const address = symbolAddress(symbol, chainId);
  const tokenData = getConfig(chainId).tokens;

  return (address &&
    tokenData.tokens[
      address.toLowerCase() as keyof typeof tokenData.tokens
    ]) as TokenDetails | undefined;
}

export function defaultTokenAddress(chainId: number) {
  const tokenData = getConfig(chainId).tokens;
  return tokenData.symbols[
    tokenData.preferredOrder[0] as keyof typeof tokenData.symbols
  ] as Address;
}

export function orderedTokens(chainId: number) {
  const tokenData = getConfig(chainId).tokens;
  return tokenData.preferredOrder
    .map((symbol) => symbolTokenDetails(symbol, chainId))
    .filter((details) => Boolean(details)) as TokenDetails[];
}

export function isEthAddress(address: string) {
  return ETH_ADDRESS_REGEX.test(address);
}
