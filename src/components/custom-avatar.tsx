"use client";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import Image from "next/image";
import { useState } from "react";
import { isAddress } from "viem";

export default function CustomAvatar({
  className,
  address,
  ensImage,
  size,
}: {
  className?: string;
  address?: string;
  ensImage?: string | null;
  size?: number;
}) {
  size = size || 40;

  if (address && !isAddress(address)) {
    console.error("Bad address provided");
  }

  const [useFallback, setUseFallback] = useState(false);
  return (
    <div
      className={cn("overflow-clip rounded-full ", className)}
      style={{
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
      }}
    >
      {!useFallback && ensImage ? (
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
      ) : (
        <BoringAvatar size='100%' name={address} variant='marble' />
      )}
    </div>
  );
}
