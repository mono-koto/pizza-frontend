import { XCircle } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Noop } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import { useEns } from "@/hooks/useEns";
import CustomAvatar from "./custom-avatar";
import { PayeeState } from "./split-form";
import { isAddress } from "viem";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLookupPyUsdTo } from "@/hooks/useLookupPyUsdTo";
import Link from "next/link";
import PyusdToContext from "./pyusdto-context";
import BlockscannerLink from "./blockscanner-link";

interface SplitFormPayeeProps {
  index: number;
  onChange: (index: number, state: PayeeState) => void;
  value: PayeeState;
  onRemove: Noop;
  total: number;
}

export function SplitFormPayeeHeader() {
  return (
    <div className='rounded-xl border-transparent border px-5 grid grid-cols-12 text-xs gap-x-3'>
      <span className='col-span-9 ml-1'>Recipient</span>
      <span className='col-span-2 text-center'>Portion</span>
    </div>
  );
}

export function SplitFormPayee({
  onChange,
  value,
  onRemove,
  total,
  index,
}: SplitFormPayeeProps) {
  const [receiver, setReceiver] = useState<string>(value.address);
  const [portion, setPortion] = useState<number>(value.portion);
  const debouncedInput = useDebounce(receiver, 500);
  const pyusd = useLookupPyUsdTo(debouncedInput);
  const ens = useEns(pyusd.data?.address || debouncedInput);

  const triggerOnChange = useCallback(
    (payee: PayeeState) => {
      onChange(index, payee);
    },
    [index, onChange]
  );

  const pyusdURL =
    pyusd.data?.kind === "nickname" && `pyusd.to/${pyusd.data.nickname}`;
  const resolvedAddress = pyusd.data?.address || ens.data.address;

  useEffect(() => {
    const label = pyusdURL ? pyusdURL : receiver;
    triggerOnChange({
      label,
      address: resolvedAddress,
      portion,
      valid: isAddress(resolvedAddress),
      id: value.id,
    });
  }, [
    triggerOnChange,
    pyusdURL,
    resolvedAddress,
    receiver,
    ens.data.address,
    portion,
    value.id,
  ]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const handlePortionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPortion(parseInt(event.target.value || "0"));
  };

  const percentage =
    total > 0 ? `${Math.round((10000 * portion || 0) / total) / 100}%` : "";

  const inputRef = useRef<HTMLInputElement>(null);
  const focusRecipientInput = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        inputRef.current?.focus();
      }
    },
    [inputRef]
  );

  const [parent] = useAutoAnimate(/* optional config */);
  const [validationParent] = useAutoAnimate(/* optional config */);

  let validation: React.ReactNode;

  if (isAddress(debouncedInput)) {
    validation = (
      <div className='text-xs text-muted-foreground col-span-11'>
        ✅ {ens.data.name || debouncedInput} · {portion} share(s) · {percentage}
      </div>
    );
  } else if (debouncedInput.endsWith(".eth") && ens.data.address) {
    validation = (
      <div className='text-xs text-muted-foreground col-span-11'>
        ✅ <BlockscannerLink address={ens.data.address} /> · {portion} share(s)
        · {percentage}
      </div>
    );
  } else if (pyusd.data?.kind === "nickname") {
    validation = (
      <PyusdToContext
        address={pyusd.data.address}
        nickname={pyusd.data.nickname}
      />
    );
  }

  return (
    <div
      className='rounded-xl border-border border p-5 gap-x-3 gap-y-3 grid grid-cols-12 items-center'
      onClick={focusRecipientInput}
      ref={parent}
    >
      <CustomAvatar
        className='self-start w-full col-span-1 row-span-2'
        address={ens.data.address}
        ensImage={ens.data.avatar}
        size={40}
      />

      <div className='flex flex-row col-span-8 gap-x-3'>
        <input
          ref={inputRef}
          type='text'
          className='w-full text-left focus:outline-none focus:ring-0 bg-muted p-2 px-2 rounded-md text-sm text-foreground '
          placeholder='ETH address, ENS, or PYUSD.to nickname'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          data-1p-ignore
          value={receiver}
          onChange={handleAddressChange}
        />
      </div>
      <input
        className='w-full col-span-2 text-center focus:outline-none focus:ring-0 bg-muted p-2 px-2 rounded-md text-sm text-foreground '
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
      <div
        className='text-xs text-muted-foreground col-span-11'
        ref={validationParent}
      >
        {validation}
      </div>
    </div>
  );
}
