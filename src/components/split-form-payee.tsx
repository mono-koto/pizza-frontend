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
}

function SplitFormPayee({ onChange, value, onRemove }: SplitFormPayeeProps) {
  // const [state, setState] = useState<PayeeState>({
  //   ...value,
  // });

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
    setPortion(parseInt(event.target.value));
  };

  return (
    <div className='col-span-8 rounded-xl border-border border p-5 grid grid-cols-12 '>
      <CustomAvatar
        address={ens.data.address}
        ensImage={ens.data.avatar}
        size={40}
      />
      <input
        type='text'
        className='w-full bg-transparent focus:outline-none focus:ring-0 col-span-9'
        placeholder='Ethereum receiver or ENS'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        data-1p-ignore
        value={receiver}
        onChange={handleAddressChange}
      />
      <input
        className='w-full bg-transparent focus:outline-none focus:ring-0 col-span-2'
        min={0}
        data-1p-ignore
        value={portion}
        onChange={handlePortionChange}
      />
      <span className='col-span-1 text-xs ml-1'>33%</span>
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

export default SplitFormPayee;
