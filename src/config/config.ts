import { Address } from "viem";
import { localhost, mainnet, sepolia } from "viem/chains";
import tokendata from "@/tokens/tokendata.json";

export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const mainnetConfig = {
  factoryAddress: "0x003722fBd9F70b4d022948104E1eE5E997687BD9" as Address,
  preferredToken: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8" as Address, // PYUSD
  tokens: tokendata["1"],
};

export const sepoliaConfig = {
  factoryAddress: "0x003722fBd9F70b4d022948104E1eE5E997687BD9" as Address,
  preferredToken: "0x45df5e83b9400421cb3b262b31ee7236b61219d5" as Address, // USDC
  tokens: tokendata["11155111"],
};

export const chainConfig = {
  [mainnet.id]: mainnetConfig,
  [sepolia.id]: sepoliaConfig,
  [localhost.id]: mainnetConfig,
};

import COLORS from "./graph-colors";
import preferredTokenOrder from "./ordered-preferred-tokens.json";

export { COLORS, preferredTokenOrder };
