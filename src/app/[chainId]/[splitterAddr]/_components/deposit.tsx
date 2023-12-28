"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { useTokenDetails } from "@/hooks/useTokenDetails";
import { useCallback, useState } from "react";
import { Address, parseUnits } from "viem";

import ERC20Abi from "@/abi/ERC20.abi";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { GasFeeDisplay } from "./gas-fee-display";

import { invalidateCache } from "../actions";
import { useContractGasEstimate } from "@/hooks/useContractGasEstimate";
import { SelectToken } from "./select-token";
import Link from "next/link";

interface DepositProps {
  defaultToken: Address;
  splitter: Address;
}

export function Deposit({ defaultToken, splitter }: DepositProps) {
  const chainId = useChainId();
  const [open, setOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");

  const [currentTokenAddress, setCurrentTokenAddress] =
    useState<Address>(defaultToken);
  const tokenDetails = useTokenDetails({ address: currentTokenAddress });

  const handleAmountInputChange = (event: any) => {
    setAmountInput(event.target.value);
  };
  const inputDisabled = !tokenDetails.data;

  const account = useAccount();
  const balanceQuery = useBalance({
    address: account.address,
    token: tokenDetails.data?.isNative ? undefined : currentTokenAddress,
    enabled: Boolean(tokenDetails.data),
  });

  const rawAmountInput = parseUnits(
    amountInput,
    tokenDetails.data?.decimals || 0
  );
  const writeEnabled = Boolean(
    balanceQuery.data &&
      rawAmountInput > 0n &&
      rawAmountInput <= balanceQuery.data.value
  );
  const prepareTransfer = usePrepareContractWrite({
    abi: ERC20Abi,
    address: writeEnabled ? currentTokenAddress : undefined, // workaround the wagmi bug
    functionName: "transfer",
    args: [splitter, rawAmountInput],
    enabled: writeEnabled, // wagmi but ignores the enabled flag
  });

  const transfer = useContractWrite(prepareTransfer.config);

  const prepareTransferETH = usePrepareSendTransaction({
    to: splitter,
    value: rawAmountInput,
    enabled: writeEnabled,
  });

  const transferETH = useSendTransaction(prepareTransferETH.config);

  useWaitForTransaction({
    hash: transfer.data?.hash || transferETH.data?.hash,
    onSuccess: () => {
      toast.success("Deposit successful");
      setOpen(false);
      balanceQuery.refetch();
      invalidateCache({
        chainId,
        address: splitter,
      });
    },
    onError: () => {
      toast.error("Deposit failed");
    },
  });

  const handleDeposit = useCallback(async () => {
    if (tokenDetails.data?.isNative) {
      transferETH.sendTransaction?.();
    } else {
      transfer.write?.();
    }
  }, [transfer, transferETH, tokenDetails.data?.isNative]);

  const disabled = tokenDetails.data?.isNative
    ? !prepareTransferETH.isSuccess
    : !prepareTransfer.isSuccess;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAmountInput("");
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='p h-fit rounded-xl bg-primary'>
          Deposit {tokenDetails.data?.symbol || ""}
        </Button>
      </DialogTrigger>
      <DialogContent className='px-4'>
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>Deposit into this splitter</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4'>
          {/* <SelectToken defaultToken={defaultToken} onChange={(token) => {}} /> */}

          <div className='border-gray flex flex-col rounded-xl border p-2'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex-1'>
                <Label className='text-sm'>Amount to deposit:</Label>

                <input
                  placeholder='0.0'
                  type='number'
                  value={amountInput}
                  onChange={handleAmountInputChange}
                  className='h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0'
                  disabled={inputDisabled}
                />
              </div>

              <Image
                src={tokenDetails.data?.logo || ""}
                alt={`${tokenDetails.data?.symbol || ""} Token Logo`}
                height={50}
                width={50}
              />
            </div>
            <div className='flex flex-row justify-between gap-2 text-xs'>
              <span className='text-gray-500'>
                Your balance: {balanceQuery.data?.formatted} (
                <SelectToken
                  defaultToken={currentTokenAddress}
                  onChange={setCurrentTokenAddress}
                  buttonElement={
                    <a className='text-xs text-primary-foreground hover:underline cursor-pointer'>
                      Use a different token
                    </a>
                  }
                />
                )
              </span>
            </div>
          </div>

          <Button
            className='p h-fit rounded-xl bg-primary'
            disabled={disabled}
            onClick={handleDeposit}
          >
            Deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
