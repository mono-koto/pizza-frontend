"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TokenDetails } from "@/models";

import { CommandList } from "@/components/ui/command";
import preferredTokens from "@/config/ordered-preferred-tokens.json";
import useTokenBalances from "@/hooks/useTokenBalances";
import { useOrderedTokens, useTokenDetails } from "@/hooks/useTokenDetails";
import { symbolAddress } from "@/lib/tokens";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "cmdk";
import Image from "next/image";
import { useState } from "react";
import { Address, formatUnits, isAddress } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { TokenButton } from "./token-button";
import { format } from "path";
import { ETH_ADDRESS } from "@/config/config";
import { TokenBalanceSuccess } from "alchemy-sdk";

interface TokenSelectProps {
  defaultToken: Address;
  onChange: (token: Address) => void;
  buttonElement: React.ReactNode;
}

function TokenDisplay({ token }: { token: TokenDetails | undefined }) {
  if (!token) {
    return <span>Select a token</span>;
  } else {
    return (
      <>
        <Image
          src={token.logo}
          className='mr-1.5 h-6 w-6'
          width={24}
          height={24}
          alt={`${token.symbol} Token Logo`}
        />
        <div>{token.symbol}</div>
      </>
    );
  }
}

export function SelectToken({
  defaultToken,
  onChange,
  buttonElement,
}: TokenSelectProps) {
  const chainId = useChainId();

  const owner = useAccount();
  const tokenBalances = useTokenBalances({ address: owner.address });

  const balances = [...(tokenBalances.data?.tokenBalances || [])];
  const ethBalance = useBalance({
    address: owner.address,
  });
  if (ethBalance.isSuccess && ethBalance.data!.value > 0n) {
    balances.push({
      contractAddress: ETH_ADDRESS,
      tokenBalance: ethBalance.data!.value.toString(),
    } as TokenBalanceSuccess);
  }

  const [currentToken, setCurrentToken] = useState<Address>(defaultToken);

  const [commandInputValue, setCommandInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Address | undefined>();

  const onSelect = (token: Address) => {
    setOpen(false);
    setValue(token);
    setCurrentToken(token);
    if (token !== value) {
      onChange(token);
    }
  };

  const onCommandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandInputValue(e.target.value);
    if (isAddress(e.target.value)) {
      setCurrentToken(e.target.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonElement}</DialogTrigger>
      <DialogContent className='px-4'>
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            Select the token you want to send.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-row flex-wrap justify-center gap-2'>
          {preferredTokens.map((symbol, i) => {
            const address = symbolAddress(symbol, chainId);
            if (!address) {
              return null;
            }
            return (
              <TokenButton
                address={address}
                key={i}
                onClick={() => onSelect(address)}
              />
            );
          })}
        </div>

        <Command className='space-y-4'>
          <CommandInput
            autoFocus
            placeholder='Search tokens...'
            className='h-9 w-full p-1'
            onChangeCapture={onCommandInputChange}
            value={commandInputValue}
          />
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandList className='w-full overflow-x-clip'>
            <CommandGroup>
              {balances.map((token) => (
                <TokenCommandItem
                  key={token.contractAddress}
                  address={token.contractAddress as Address}
                  balance={token.tokenBalance || "0"}
                  onSelect={onSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function TokenCommandItem({
  address,
  balance,
  onSelect,
}: {
  address: Address;
  balance: string;
  onSelect: (address: Address) => void;
}) {
  const tokenDetails = useTokenDetails({ address });
  if (!tokenDetails.data) {
    return null;
  }

  return (
    <CommandItem
      className='cursor-pointer rounded-md p-1 transition-colors duration-75 aria-selected:bg-primary aria-selected:text-primary-foreground'
      value={`${address} ${tokenDetails.data?.name} ${tokenDetails.data?.symbol}`}
      onSelect={() => {
        onSelect(address as Address);
      }}
      hidden={false}
    >
      <TokenListDisplay
        address={address as Address}
        balance={BigInt(balance)}
      />
    </CommandItem>
  );
}

function TokenListDisplay({
  address,
  balance,
}: {
  address: Address;
  balance: bigint;
}) {
  const tokenDetails = useTokenDetails({ address });
  return (
    <div className='flex flex-row items-center space-x-2 pr-2'>
      <Image
        src={tokenDetails.data?.logo || ""}
        className='h-6 w-6'
        alt={`${tokenDetails.data?.name} Token Logo`}
        width={24}
        height={24}
      />
      <div className='overflow-ellipsis'>
        <div>{tokenDetails.data?.name}</div>
        <div className='text-sm'>
          {tokenDetails.data?.symbol}{" "}
          {tokenDetails.data &&
            formatUnits(balance, tokenDetails.data.decimals)}
        </div>
      </div>
    </div>
  );
}
