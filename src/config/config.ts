import { Address } from "viem";
import { localhost, mainnet, sepolia } from "viem/chains";
import tokendata from "@/tokens/tokendata.json";

export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const ETH_ADDRESS_REGEX = new RegExp(`^${ETH_ADDRESS}$`, "i");

export const PYUSD_ADDRESS = "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8";

export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const mainnetConfig = {
  factoryAddress: "0x84Dd987D2bf9834b0c661B493A1CcB0bf06b01C8" as Address,
  preferredToken: PYUSD_ADDRESS as Address, // PYUSD
  tokens: tokendata["1"],
  startBlock: 19072555n,
};

export const sepoliaConfig = {
  factoryAddress: "0xd3b53B180b53f754790A06C8F8FdDAf0A09F28C2" as Address,
  preferredToken: "0x45df5e83b9400421cb3b262b31ee7236b61219d5" as Address, // USDC
  tokens: tokendata["11155111"],
  startBlock: 5141429n,
};

export const localhostConfig = {
  ...mainnetConfig,
};

export const chainConfig = {
  [mainnet.id]: mainnetConfig,
  [sepolia.id]: sepoliaConfig,
  [localhost.id]: localhostConfig,
};

import COLORS from "./graph-colors";
import preferredTokenOrder from "./ordered-preferred-tokens.json";

export { COLORS, preferredTokenOrder };
