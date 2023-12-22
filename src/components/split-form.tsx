"use client";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import { Button } from "@/components/ui/button";
import { factoryAddress } from "@/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PieChart } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { SplitFormPayee, SplitFormPayeeHeader } from "./split-form-payee";
import { DonutChart } from "./donut-chart";
import { useTheme } from "next-themes";
import { usePrefersDark } from "@/hooks/usePrefersDark";
import { useIsMounted, useWindowSize } from "usehooks-ts";
import { toast } from "react-toastify";
import TransactionMessage from "./transaction-message";
import { redirect, useRouter } from "next/navigation";
import { decodeEventLog, getContract, getEventSignature } from "viem";

// Rest of the code...

const SPLITTER_CREATED_EVENT_SIGNATURE = getEventSignature({
  type: "event",
  name: "PizzaCreated",
  inputs: [
    {
      name: "pizza",
      type: "address",
      indexed: true,
      internalType: "address",
    },
  ],
  anonymous: false,
});

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
  const router = useRouter();
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
    args: [...args],
    enabled: payees.length > 0 && payees.every((f) => f.valid),
  });

  const publicClient = usePublicClient();

  const createSplitter = useContractWrite({
    ...prepareCreateSplitter.config,

    onMutate: () => {
      toast("Initiating transaction...");
    },

    onSuccess: async (data, variables, context) => {},

    onError: (data) => {
      data.message.match("User rejected")
        ? toast.warn("Transaction cancelled")
        : toast.error("Transaction failed");
    },
  });

  useWaitForTransaction({
    confirmations: 1,
    hash: createSplitter.data?.hash,

    onSuccess: (data) => {
      toast.success(
        <TransactionMessage transactionHash={data.blockHash}>
          🎉 Transaction success!
        </TransactionMessage>
      );

      for (const log of data.logs) {
        console.log(log);
        try {
          const decoded = decodeEventLog({
            abi: PizzaFactoryAbi,
            topics: log.topics,
          });
          console.log(decoded);

          if (decoded.eventName === "PizzaCreated") {
            router.push(`/${decoded.args.pizza}`);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      console.error("Expected log not found");
    },
  });

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
  const isMounted = useIsMounted();
  const prefersDark = usePrefersDark();
  const isDark =
    isMounted() &&
    (theme.theme === "dark" || (theme.theme === "system" && prefersDark));

  return (
    <div className='w-full flex flex-col gap-4 items-center'>
      <DonutChart
        labelColor={isDark ? "#fff" : "#000"}
        dataset={payees.map((f) => ({
          name: f.label,
          value: f.portion,
          id: f.id,
        }))}
        className='mx-auto w-full max-w-[800px] min-w-[300px]'
        labeled
      />
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-row flex-wrap justify-between gap-3'>
          <h3 className='text-2xl mb-1'>New Splitter</h3>

          <Button variant='outline' type='button' onClick={addPayee}>
            <PieChart className='w-4 h-4 mr-4' />
            Add payee
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
          {payees.length === 0
            ? "Add a payee"
            : `Create ${payees.length}-way Splitter`}
        </Button>
      </div>
    </div>
  );
};

export default SplitForm;
