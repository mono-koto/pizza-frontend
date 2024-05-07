import { addressColors } from "@/lib/utils";
import { CreationInfo, Splitter, SplitterAssetState } from "@/models";
import Link from "next/link";
import { formatUnits } from "viem";
import { useChainId, useToken } from "wagmi";
import BlockscannerLink from "./blockscanner-link";
import CustomAvatar from "./custom-avatar";
import { DonutChart } from "./donut-chart";
import { Button } from "./ui/button";
import SplitterMiniDonutChart from "./splitter-mini-donut-chart";
import { useRouter } from "next/navigation";

export default function SplitterListItem(
  props: Splitter & SplitterAssetState & CreationInfo
) {
  const tokenQuery = useToken({
    address: props.token,
  });

  let decimals: number | undefined;
  let symbol: string | undefined;

  if (!props.token) {
    decimals = 18;
    symbol = "ETH";
  } else if (tokenQuery.data) {
    decimals = tokenQuery.data.decimals;
    symbol = tokenQuery.data.symbol;
  }

  const router = useRouter();
  return (
    <div className="flex flex-row gap-4 text-xs splitter-list-item border border-border rounded-lg p-4 justify-stretch hover:border-foreground transition-colors cursor-pointer">
      <div className=" self-start flex flex-col justify-center">
        <div onClick={() => router.push(`/${props.address}`)}>
          <SplitterMiniDonutChart address={props.address} />
        </div>

        <Button
          asChild
          size="sm"
          className="justify-self-stretch no-underline text-xs h-7"
          variant="ghost"
        >
          <Link href={`/${props.address}`}>Details</Link>
        </Button>
      </div>
      <div className=" w-full space-y-2">
        <div className="flex flex-row justify-between flex-wrap items-baseline">
          <h3 className="text-2xl">{props.payees.length}-way</h3>
        </div>
        <p>
          <BlockscannerLink address={props.address} kind="contract" />
        </p>

        <div>
          Created by{" "}
          <BlockscannerLink address={props.creator} kind="address" ens short />
          on {new Date(Number(props.createdAt) * 1000).toLocaleString()}
        </div>

        {typeof decimals !== "undefined" && symbol && (
          <>
            <div>
              Balance: {formatUnits(props.balance, decimals)} {symbol}
            </div>
          </>
        )}
        <div className="flex flex-row items-center gap-1">
          {props.payees.length} Payees:
          <div className="ml-2 inline-block">
            {props.payees.map((p, i) => (
              <CustomAvatar
                key={p}
                address={p}
                className="inline-block grow-0 w-4 h-4 -ml-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
