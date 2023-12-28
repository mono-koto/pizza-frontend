import { PublicClient, createWalletClient, custom } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export function temporaryWalletClient(publicClient: PublicClient) {
  const account = privateKeyToAccount(generatePrivateKey());
  return createWalletClient({
    account,
    chain: publicClient.chain,
    transport: custom(publicClient),
  });
}
