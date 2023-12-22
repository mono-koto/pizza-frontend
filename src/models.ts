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
