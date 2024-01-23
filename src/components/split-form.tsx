"use client";
import PizzaFactoryAbi from "@/abi/PizzaFactory.abi";
import { Button } from "@/components/ui/button";

import useIsDark from "@/hooks/useIsDark";
import getConfig from "@/lib/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PieChart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { decodeEventLog, getEventSignature } from "viem";
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { DonutChart } from "./donut-chart";
import { SplitFormPayee, SplitFormPayeeHeader } from "./split-form-payee";
import TransactionMessage from "./transaction-message";

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
  const chainId = useChainId();
  const { factoryAddress } = getConfig(chainId);
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

  const allUnique =
    new Set(payees.map((p) => p.address?.toLowerCase())).size === payees.length;

  const prepareCreateSplitter = usePrepareContractWrite({
    abi: PizzaFactoryAbi,
    address: factoryAddress,
    functionName: "create",
    args: [...args],
    enabled: payees.length > 0 && payees.every((f) => f.valid) && allUnique,
  });

  const createSplitter = useContractWrite({
    ...prepareCreateSplitter.config,

    onMutate: () => {
      toast("Initiating transaction...");
    },

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
          🎉 Transaction success! Redirecting...
        </TransactionMessage>
      );

      for (const log of data.logs) {
        try {
          const decoded = decodeEventLog({
            abi: PizzaFactoryAbi,
            topics: log.topics,
          });

          if (decoded.eventName === "PizzaCreated") {
            router.push(`/${decoded.args.pizza}`);
            return;
          }
        } catch (e) {
          console.debug("Failed to decode log", e);
        }
      }
      console.error("Expected log not found");
    },
  });

  const submit = useCallback(() => {
    createSplitter.write && createSplitter.write();
  }, [createSplitter]);

  const onChange = useCallback((index: number, state: PayeeState) => {
    setPayees((prev) => {
      const newPayees = [...prev];
      newPayees[index] = state;
      return newPayees;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPayees((prev) => prev.filter((payee, i) => payee.id !== id));
  }, []);

  const isDark = useIsDark();
  const total = payees.reduce((acc, curr) => acc + curr.portion, 0);

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
              index={index}
              onChange={onChange}
              value={payee}
              total={total}
              onRemove={() => remove(payee.id)}
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
