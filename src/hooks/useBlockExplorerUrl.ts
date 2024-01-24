import { localhost, mainnet } from "viem/chains";
import { usePublicClient } from "wagmi";

export type UrlKind =
  | "address"
  | "transaction"
  | "token"
  | "contract"
  | "block";

type Options = {
  id: string;
  kind: UrlKind;
};

export const useBlockExplorerUrl = ({ id, kind }: Options) => {
  const chain = usePublicClient().chain;

  const path = kind === "contract" ? "address" : kind;
  const fragment = kind === "contract" ? "#code" : undefined;

  const blockExplorer =
    chain === localhost
      ? mainnet.blockExplorers.default
      : chain?.blockExplorers?.default;
  const url = blockExplorer
    ? `${blockExplorer.url}/${path}/${id}${fragment}`
    : undefined;
  return {
    blockExplorer,
    url: url,
  };
};
