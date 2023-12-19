"use client";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import { Button } from "@/components/ui/button";
import { factoryAddress } from "@/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// import { randomUUID } from "crypto";
import { PieChart } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import SplitFormPayee from "./split-form-payee";

export type PayeeState = {
  address: string;
  portion: number;
  id: string;
  valid: boolean;
};

interface SplitFormProps {}

const SplitForm: React.FC<SplitFormProps> = ({}) => {
  const [payees, setPayees] = useState<PayeeState[]>([
    {
      address: "",
      portion: 100,
      id: crypto.randomUUID(),
      valid: false,
    },
    {
      address: "",
      portion: 100,
      id: crypto.randomUUID(),
      valid: false,
    },
  ]);

  const [parent] = useAutoAnimate(/* optional config */);

  const addPayee = useCallback(() => {
    setPayees([
      { address: "", portion: 100, id: crypto.randomUUID(), valid: false },
      ...payees,
    ]);
  }, [setPayees, payees]);

  const args: readonly [readonly `0x${string}`[], readonly bigint[]] = [
    payees.map((f) => f.address as `0x${string}`),
    payees.map((f) => BigInt(f.portion)),
  ];
  const prepareCreateSplitter = usePrepareContractWrite({
    abi: PizzaFactoryAbi,
    address: factoryAddress,
    functionName: "create",
    args,
    enabled: payees.length > 0 && payees.every((f) => f.valid),
  });

  const createSplitter = useContractWrite(prepareCreateSplitter.config);

  const submit = useCallback(() => {
    createSplitter.write && createSplitter.write();
  }, [prepareCreateSplitter]);

  const onChange = useCallback(
    (index: number, state: PayeeState) => {
      setPayees((prev) => {
        const newPayees = [...prev];
        newPayees[index] = state;
        return newPayees;
      });
    },
    [setPayees]
  );

  const remove = useCallback(
    (index: number) => {
      setPayees((prev) => prev.filter((_, i) => i !== index));
    },
    [setPayees]
  );

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-row flex-wrap justify-between'>
        <h3 className='text-2xl mb-4'>Create a Splitter</h3>

        <Button variant='outline' type='button' onClick={addPayee}>
          <PieChart className='w-4 h-4 mr-4' />
          Add recipient
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='grid grid-cols-12 gap-x-3'>
          <span className='col-span-8 text-xs ml-1'>Address</span>
          <span className='col-span-2 text-xs ml-1'>Portion</span>
          <span className='col-span-1'></span>
        </div>
        <div className='grid grid-cols-12 gap-3 items-baseline' ref={parent}>
          {payees.map((payee, index) => (
            <SplitFormPayee
              key={payee.id}
              placeholder='Last name'
              onChange={(state) => onChange(index, state)}
              value={payee}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      </div>
      <Button
        onClick={submit}
        className='w-full'
        disabled={!prepareCreateSplitter.isSuccess}
      >
        Create {payees.length}-way Splitter
      </Button>
    </div>
  );
};

export default SplitForm;
