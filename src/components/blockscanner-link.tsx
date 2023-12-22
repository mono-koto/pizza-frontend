"use client";

import { UrlKind, useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import { shortAddress } from "@/lib/utils";
import { Copy } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { Address } from "viem";
import { useEnsName } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";

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
    <CopyToClipboard
      text={address}
      onCopy={() => toast.success("Copied address to clipboard")}
    >
      <Button size='icon' className='w-3 h-3 mx-1 rounded-sm' variant='ghost'>
        <Copy className='w-3 h-3' />
      </Button>
    </CopyToClipboard>
  );

  return (
    <span>
      {content}
      {clipboardButton}
    </span>
  );
}
