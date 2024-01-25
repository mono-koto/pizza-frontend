import BlockscannerLink from "@/components/blockscanner-link";
import CustomAvatar from "@/components/custom-avatar";
import { useEns } from "@/hooks/useEns";
import { formatPercent } from "@/lib/utils";
import { Address } from "viem";

interface PayeeRowProps {
  address: Address;
  share: bigint;
  totalShares: bigint;
}

const SIZE = 32;

export const PayeeRow = ({ address, share, totalShares }: PayeeRowProps) => {
  const ens = useEns(address);

  const pct = formatPercent(share, totalShares);

  return (
    <div className='flex flex-row items-center justify-stretch gap-2'>
      <CustomAvatar address={address} size={SIZE} />
      <BlockscannerLink address={address} kind='address' short ens />
      <div className='flex-1 text-right'>
        <span className='text-sm text-muted-foreground'>{pct}%</span>{" "}
      </div>
    </div>
  );
};
