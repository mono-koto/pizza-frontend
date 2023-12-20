import { XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Noop } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import { useEns } from "@/hooks/useEns";
import CustomAvatar from "./custom-avatar";
import { PayeeState } from "./split-form";
import { isAddress } from "viem";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface SplitFormPayeeProps {
  onChange: (state: PayeeState) => void;
  value: PayeeState;
  placeholder: string;
  onRemove: Noop;
  total: number;
}

export function SplitFormPayeeHeader() {
  return (
    <div className='rounded-xl border-transparent border px-5 grid grid-cols-12 text-xs gap-x-3'>
      <span className='col-start-2 col-span-8 ml-1'>Address</span>
      <span className='col-span-2 text-center'>Portion</span>
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

  const debouncedAddress = useDebounce(receiver, 500);
  const ens = useEns(debouncedAddress);

  useEffect(() => {
    onChange({
      label: receiver,
      address: ens.data.address,
      portion,
      valid: isAddress(ens.data.address),
      id: value.id,
    });
  }, [receiver, ens.data.address, portion, value.id]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const handlePortionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPortion(parseInt(event.target.value || "0"));
  };

  const percentage =
    total > 0 ? `${Math.round((10000 * portion || 0) / total) / 100}%` : "";

  const inputRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        inputRef.current?.focus();
      }
    },
    [inputRef]
  );

  const [parent] = useAutoAnimate(/* optional config */);

  return (
    <div
      className='rounded-xl border-border border p-5 gap-x-3 gap-y-2 grid grid-cols-12 align-baseline'
      onClick={focus}
      ref={parent}
    >
      <CustomAvatar
        className='col-span-1 self-center'
        address={ens.data.address}
        ensImage={ens.data.avatar}
        size={40}
      />
      <input
        ref={inputRef}
        type='text'
        className='w-full text-left focus:outline-none focus:ring-0 col-span-8 bg-muted p-1 px-2 rounded-md text-sm text-foreground '
        placeholder='ETH address or ENS'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        data-1p-ignore
        value={receiver}
        onChange={handleAddressChange}
      />
      <input
        className='w-full col-span-2 text-center  focus:outline-none focus:ring-0 bg-muted p-1 px-2 rounded-md text-sm text-foreground '
        min={1}
        type='number'
        data-1p-ignore
        value={portion}
        onChange={handlePortionChange}
      />
      <Button
        variant='ghost'
        onClick={onRemove}
        className='justify-self-end col-span-1 self-center text-muted-foreground hover:text-destructive-foreground hover:bg-destructive'
        size='icon'
      >
        <XCircle className='w-4 h-4' />
      </Button>

      {(isAddress(receiver) ||
        (receiver.endsWith(".eth") && ens.data.address)) && (
        <div className='col-start-2 col-span-11 text-left text-xs text-muted-foreground'>
          {receiver.endsWith(".eth") || !ens.data.name
            ? `✅ ${ens.data.address} | ${portion} share(s) | ${percentage}`
            : `${ens.data.name} | ${portion} share(s) | ${percentage}`}
        </div>
      )}
    </div>
  );
}
