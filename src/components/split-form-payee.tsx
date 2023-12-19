import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Noop } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import { useEns } from "@/hooks/useEns";
import CustomAvatar from "./custom-avatar";
import { PayeeState } from "./split-form";
import { isAddress } from "viem";

interface SplitFormPayeeProps {
  onChange: (state: PayeeState) => void;
  value: PayeeState;
  placeholder: string;
  onRemove: Noop;
  total: number;
}

export function SplitFormPayeeHeader() {
  return (
    <div className='rounded-xl border-transparent border p-5 grid grid-cols-12 text-xs'>
      <span className='col-start-1 col-span-9 ml-1'>Address</span>
      <span className='ml-1'>Portion</span>
      <span className=''></span>
    </div>
  );
}

export function SplitFormPayee({
  onChange,
  value,
  onRemove,
  total,
}: SplitFormPayeeProps) {
  const [receiver, setReceiver] = useState<string>(value.address);
  const [portion, setPortion] = useState<number>(value.portion);

  const debouncedAddress = useDebounce(receiver, 1000);
  const ens = useEns(debouncedAddress);

  useEffect(() => {
    onChange({
      address: ens.data.address,
      portion,
      valid: isAddress(ens.data.address),
      id: value.id,
    });
  }, [ens.data.address, portion, value.id]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const handlePortionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPortion(parseInt(event.target.value || "0"));
  };

  const percentage =
    total > 0 ? `${Math.round((10000 * portion || 0) / total) / 100}%` : "";

  return (
    <div className='rounded-xl border-border border p-5 gap-3 grid grid-cols-12 align-baseline'>
      <CustomAvatar
        className='col-span-1 self-center'
        address={ens.data.address}
        ensImage={ens.data.avatar}
        size={40}
      />
      <input
        type='text'
        className='w-full bg-transparent focus:outline-none focus:ring-0 col-span-6'
        placeholder='ETH address or ENS'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        data-1p-ignore
        value={receiver}
        onChange={handleAddressChange}
      />
      <div className='col-span-2 flex flex-row align-baseline'>
        <input
          className='bg-transparent focus:outline-none focus:ring-0 w-2/3  text-right'
          min={1}
          type='number'
          data-1p-ignore
          value={portion}
          onChange={handlePortionChange}
        />
      </div>
      <span className='col-span-1 text-xs ml-1'>{percentage}</span>
      <Button
        variant='ghost'
        onClick={onRemove}
        className='justify-self-end col-span-1 self-center text-muted-foreground hover:text-destructive-foreground hover:bg-destructive'
        size='icon'
      >
        <XCircle className='w-4 h-4' />
      </Button>
    </div>
  );
}
