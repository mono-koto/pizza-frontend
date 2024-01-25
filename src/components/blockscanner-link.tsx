"use client";

import { UrlKind, useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import { shortAddress } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import { Address } from "viem";
import { useEnsName } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import { useCallback } from "react";

type Props = {
  address: string;
  kind?: UrlKind;
  short?: boolean;
  ens?: boolean;
  children?: React.ReactNode;
};

export default function BlockscannerLink({
  address,
  kind,
  short,
  ens,
  children,
}: Props) {
  const { url, blockExplorer } = useBlockExplorerUrl({
    id: address,
    kind: kind || "address",
  });

  const [copiedText, copy] = useCopyToClipboard();

  const copyToClipboard = useCallback(
    (content: string) => {
      copy(content);
      toast.success("Copied to clipboard");
    },
    [copy]
  );

  const ensQuery = useEnsName({
    address: address as Address,
    chainId: 1,
    enabled:
      (ens && kind === "address") || kind === "token" || kind === "contract",
  });

  let displayName = address as string;
  if (ens && ensQuery.data) {
    displayName = ensQuery.data;
  } else if (short) {
    displayName = shortAddress(address);
  }

  console.log(displayName, ensQuery.data);

  const content = url ? (
    <Link
      target='_blank'
      href={url}
      title={`View on ${blockExplorer?.name}`}
      className='hover:underline'
    >
      {children || displayName}
    </Link>
  ) : (
    <span>{children || displayName}</span>
  );

  const clipboardButton = (
    <Button
      size='icon'
      className='w-3 h-3 mx-1 rounded-sm'
      variant='ghost'
      onClick={copyToClipboard.bind(null, address)}
    >
      <Copy className='w-3 h-3' />
    </Button>
  );

  return (
    <span>
      {content}
      {clipboardButton}
    </span>
  );
}
