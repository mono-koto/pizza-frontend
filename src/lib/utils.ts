import { COLORS } from "@/config/config";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address, formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPercent(share: number | bigint, total: number | bigint) {
  return Number(((100 * Number(share)) / Number(total)).toFixed(2)).toString();
}

export function formatTokenAmount(amount: bigint, decimals: number) {
  const precision = Math.floor(decimals / 4);

  return Number(
    Number(formatUnits(amount, decimals)).toFixed(precision)
  ).toString();
}

export function addressColors(addresses: readonly Address[]) {
  return addresses.map((addr, i) => {
    const colorIndex: bigint =
      (BigInt(addr) + BigInt(i)) % BigInt(COLORS.length);
    return COLORS[Number(colorIndex)];
  });
}

export function isURL(s: any) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}
