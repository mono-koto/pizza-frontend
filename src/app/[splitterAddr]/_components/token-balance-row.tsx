import { Button } from "@/components/ui/button";
import { formatTokenAmount } from "@/lib/utils";
import Image from "next/image";
import { release } from "os";
import { Address } from "viem";
import { TokenImg } from "./token-img";

type TokenBalance = {
  name?: string;
  symbol?: string;
  address: Address;
  decimals?: number;
  logoURI?: string;
  balance: bigint;
};

interface TokenBalanceRowProps {
  token: TokenBalance;
  releaseButton?: React.ReactNode;
}

const SIZE = 32;

export const TokenBalanceRow = ({
  token,
  releaseButton,
}: TokenBalanceRowProps) => {
  const decimals = typeof token.decimals === "undefined" ? 18 : token.decimals;
  return (
    <div className='flex flex-row items-baseline gap-2'>
      <div className='w-fit h-fit grow-0 self-center justify-self-center'>
        <TokenImg address={token.address} />
      </div>
      <div>{token.symbol}</div>
      <div className='grow text-right'>
        {formatTokenAmount(token.balance, decimals)}
      </div>
      <div>{releaseButton}</div>
    </div>
  );
};
