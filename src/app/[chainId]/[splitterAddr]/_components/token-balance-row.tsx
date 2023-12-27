import { formatTokenAmount } from "@/lib/utils";
import { TokenDetails } from "@/models";
import Image from "next/image";
import { Address } from "viem";

type TokenBalance = {
  name?: string;
  symbol?: string;
  address: Address;
  decimals?: number;
  logoURI?: string;
  balance: string;
  // rawBalance: string;
};

interface TokenBalanceRowProps {
  token: TokenBalance;
}

const SIZE = 20;

export const TokenBalanceRow: React.FC<TokenBalanceRowProps> = ({ token }) => {
  const decimals = typeof token.decimals === "undefined" ? 18 : token.decimals;
  return (
    <div className='flex flex-row gap-2'>
      <div className='w-fit h-fit grow-0'>
        {token.logoURI ? (
          <Image
            className='self-center'
            src={token.logoURI}
            width={SIZE}
            height={SIZE}
            alt={token.symbol || token.name || token.address}
          />
        ) : (
          <div
            className={`w-[${SIZE}px] h-[${SIZE}px] rounded-full bg-gray-200`}
          ></div>
        )}
      </div>
      <div>{token.symbol}</div>
      <div className='grow text-right'>
        {formatTokenAmount(BigInt(token.balance), decimals)}
      </div>
    </div>
  );
};
