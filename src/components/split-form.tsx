"use client";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import { Button } from "@/components/ui/button";
import { factoryAddress } from "@/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// import { randomUUID } from "crypto";
import { PieChart } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { SplitFormPayee, SplitFormPayeeHeader } from "./split-form-payee";
import { DonutChart } from "./donut-chart";
import { useTheme } from "next-themes";
import { shuffle } from "d3";

const colors: string[] = [
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
  "#ede15b",
  "#bdcf32",
  "#87bc45",
  "#27aeef",
  "#b33dc6",
  "#b30000",
  "#7c1158",
  "#4421af",
  "#1a53ff",
  "#0d88e6",
  "#00b7c7",
  "#5ad45a",
  "#8be04e",
  "#ebdc78",
  "#e60049",
  "#0bb4ff",
  "#50e991",
  "#e6d800",
  "#9b19f5",
  "#ffa300",
  "#dc0ab4",
  "#b3d4ff",
  "#00bfa0",
];
// const colors = shuffle(complementaryColors);

// Rest of the code...

export type PayeeState = {
  label?: string;
  address: string;
  ensName?: string;
  ensImage?: string;
  portion: number;
  id: string;
  valid: boolean;
};

interface SplitFormProps {}

function randomPayee() {
  return {
    address: "",
    portion: 5,
    id: crypto.randomUUID(),
    valid: false,
  };
}

const initialPayees = [randomPayee(), randomPayee()];

const SplitForm: React.FC<SplitFormProps> = ({}) => {
  const [payees, setPayees] = useState<PayeeState[]>(initialPayees);

  const [parent] = useAutoAnimate(/* optional config */);

  const addPayee = useCallback(() => {
    setPayees([randomPayee(), ...payees]);
  }, [setPayees, payees]);

  const args: readonly [readonly `0x${string}`[], readonly bigint[]] = [
    payees.map((f) => f.address as `0x${string}`),
    payees.map((f) => BigInt(f.portion || 0)),
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
  }, [createSplitter]);

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

  const theme = useTheme();
  const prefersDark = (window as any).matchMedia(
    "(prefers-color-scheme: dark)"
  );
  const isDark =
    (theme.theme === "system" && prefersDark) || theme.theme === "dark";

  return (
    <div className='w-full space-y-4'>
      <DonutChart
        labelColor={isDark ? "#fff" : "#000"}
        width={650}
        height={200}
        colors={colors}
        dataset={payees.map((f) => ({
          name: f.label,
          value: f.portion,
          id: f.id,
        }))}
        className='mx-auto  w-fit'
      />
      <div className='flex flex-row flex-wrap justify-between'>
        <h3 className='text-2xl mb-4'>Create a Splitter</h3>

        <Button variant='outline' type='button' onClick={addPayee}>
          <PieChart className='w-4 h-4 mr-4' />
          Add recipient
        </Button>
      </div>

      <div className='space-y-2' ref={parent}>
        <SplitFormPayeeHeader />
        {payees.map((payee, index) => (
          <SplitFormPayee
            key={payee.id}
            placeholder='Last name'
            index={index}
            onChange={onChange}
            value={payee}
            total={payees.reduce((acc, curr) => acc + curr.portion, 0)}
            onRemove={() => remove(index)}
          />
        ))}
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
