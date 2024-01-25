import { ETH_ADDRESS } from "@/config/config";
import { useTokenDetails } from "@/hooks/useTokenDetails";
import Image from "next/image";
import { Address } from "viem";

const SIZE = 32;

export const TokenImg = ({
  address,
  size = SIZE,
}: {
  address: Address | undefined;
  size?: number;
}) => {
  const token = useTokenDetails({
    address: address || ETH_ADDRESS,
  });

  if (token.data?.logo) {
    return (
      <Image
        className='rounded-full'
        src={token.data?.logo}
        width={size}
        height={size}
        alt={token.data?.symbol || token.data?.name || address || "ETH"}
      />
    );
  } else {
    return (
      <div
        className={`w-[${size}px] h-[${size}px] rounded-full bg-gray-200`}
      ></div>
    );
  }
};
