"use client";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import Image from "next/image";
import { useState } from "react";
import { isAddress } from "viem";
import { UserRound } from "lucide-react";

interface CustomAvatarProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  address?: string;
  ensImage?: string | null;
  size?: number;
}

export default function CustomAvatar({
  size,
  className,
  ensImage,
  address,
  ...remainingProps
}: CustomAvatarProps) {
  // console.log(address);
  size = size || 40;
  const [useFallback, setUseFallback] = useState(false);

  function Img() {
    if (!address || !isAddress(address)) {
      // console.log("[CustomAvatar] invalid address generic avatar:", address);
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

  return (
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
}
