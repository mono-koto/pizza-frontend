import { localhost, mainnet } from "viem/chains";
import { usePublicClient } from "wagmi";

export type UrlKind =
  | "address"
  | "transaction"
  | "token"
  | "contract"
  | "block";

type Options = {
  id?: string;
  kind: UrlKind;
};

export const useBlockExplorerUrl = ({ id, kind }: Options) => {
  const chain = usePublicClient().chain;

  let path: string = kind;
  if (kind === "contract") {
    path = "address";
  }
  if (kind === "transaction") {
    path = "tx";
  }
  const fragment = kind === "contract" ? "#code" : "";

  const blockExplorer =
    chain === localhost
      ? mainnet.blockExplorers.default
      : chain?.blockExplorers?.default;
  const url =
    id && blockExplorer
      ? `${blockExplorer.url}/${path}/${id}${fragment}`
      : undefined;
  return {
    blockExplorer,
    url: url,
  };
};
