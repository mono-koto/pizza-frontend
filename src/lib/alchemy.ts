import { Network, Alchemy } from "alchemy-sdk";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const alchemyNetwork = (chainId: number) => {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 5:
      return Network.ETH_GOERLI;
    case 11155111:
      return Network.ETH_SEPOLIA;
    default:
      return Network.ETH_MAINNET;
  }
};

export const alchemyClient = (chainId: number) => {
  console.log(API_KEY, alchemyNetwork(chainId));
  return new Alchemy({
    apiKey: API_KEY,
    network: alchemyNetwork(chainId),
    maxRetries: 1,
  });
};
