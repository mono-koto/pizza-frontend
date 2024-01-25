"use client";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import Image from "next/image";
import { useState } from "react";
import { isAddress } from "viem";
import { UserRound } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import BlockscannerLink from "./blockscanner-link";
import { useEns } from "@/hooks/useEns";
import { useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import Link from "next/link";

interface CustomAvatarProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  address?: string;
  tooltip?: boolean;
  ensImage?: string | null;
  size?: number;
}

export default function CustomAvatar({
  size,
  className,
  tooltip,
  ensImage,
  address,
  ...remainingProps
}: CustomAvatarProps) {
  // console.log(address);
  size = size || 40;
  const [useFallback, setUseFallback] = useState(false);

  const ens = useEns(address);

  const { url } = useBlockExplorerUrl({
    id: address,
    kind: "address",
  });

  function Img() {
    if (!address || !isAddress(address)) {
      return (
        <div className='w-full aspect-square bg-muted rounded-full flex justify-center  items-center text-muted-foreground '>
          <UserRound className='w-4 h-4 -translate-y-[1px]' />
        </div>
      );
    } else if (!useFallback && ensImage) {
      // console.log("[CustomAvatar] ENS avatar", ensImage);
      return (
        <Image
          unoptimized
          src={ensImage || ""}
          alt={`ENS avatar of ${address}`}
          height={size}
          width={size}
          onError={() => {
            setUseFallback(true);
          }}
        />
      );
    } else {
      // console.log("[CustomAvatar] BoringAvatar fallback");
      return <BoringAvatar size='100%' name={address} variant='marble' />;
    }
  }

  const node = (
    <div
      className={cn("overflow-clip rounded-full aspect-square", className)}
      {...remainingProps}
      style={{
        maxWidth: `${size}px`,
        ...remainingProps.style,
      }}
    >
      <Img />
    </div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {url ? <Link href={url}>{node}</Link> : node}
          </TooltipTrigger>
          <TooltipContent>
            {address ? (
              <BlockscannerLink address={address}>
                {ens.data.name || address}
              </BlockscannerLink>
            ) : (
              address
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return node;
  }
}
