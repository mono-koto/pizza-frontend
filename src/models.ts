import { Address } from "viem";

export interface Splitter {
  address: Address;
  payees: readonly Address[];
  shares: readonly bigint[];
}

export interface SplitterAssetState {
  token: Address | undefined;
  totalReleased: bigint;
  balance: bigint;
}

export interface CreationInfo {
  transactionHash: string;
  createdAt: bigint;
  creator: Address;
}

export interface TokenDetails {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  chainId: number;
  logo: string;
  isNative?: boolean;
}
