import { Address } from "viem";

export function shortAddress(address: Address) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
