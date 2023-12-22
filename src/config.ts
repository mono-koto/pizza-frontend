import { Address } from "viem";
import { localhost, mainnet, sepolia } from "viem/chains";
import tokenmap from "@/tokens/tokenmap.json";

export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const mainnetConfig = {
  factoryAddress: "0x003722fBd9F70b4d022948104E1eE5E997687BD9" as Address,
  preferredToken: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8" as Address, // PYUSD
  tokens: tokenmap["1"],
};

export const sepoliaConfig = {
  factoryAddress: "0x003722fBd9F70b4d022948104E1eE5E997687BD9" as Address,
  preferredToken: "0x45df5e83b9400421cb3b262b31ee7236b61219d5" as Address, // USDC
  tokens: tokenmap["11155111"],
};

export const chainConfig = {
  [mainnet.id]: mainnetConfig,
  [sepolia.id]: sepoliaConfig,
  [localhost.id]: mainnetConfig,
};

export const preferredTokenSymbols = [
  "PYUSD",
  "USDC",
  "ETH",
  "USDT",
  "DAI",
  "WETH",
  "WBTC",
];

export const COLORS: string[] = [
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
  "#ede15b",
  "#bdcf32",
  "#87bc45",
  "#27aeef",
  "#b33dc6",
  "#b30000",
  "#7c1158",
  "#4421af",
  "#1a53ff",
  "#0d88e6",
  "#00b7c7",
  "#5ad45a",
  "#8be04e",
  "#ebdc78",
  "#e60049",
  "#0bb4ff",
  "#50e991",
  "#e6d800",
  "#9b19f5",
  "#ffa300",
  "#dc0ab4",
  "#b3d4ff",
  "#00bfa0",
].reverse();
