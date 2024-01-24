import { shortAddress } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next/types";
import { Address, isAddress } from "viem";
import Splitter from "./_components/splitter-component";

interface SplitterPageProps {
  params: {
    splitterAddr: Address;
  };
}

export async function generateMetadata(
  { params }: SplitterPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const short = shortAddress(params.splitterAddr);

  return {
    title: `${short} | ${(await parent).title?.absolute}`,
  };
}

export default function SplitterPage(props: SplitterPageProps) {
  if (!isAddress(props.params.splitterAddr)) {
    notFound();
  }

  return <Splitter splitterAddr={props.params.splitterAddr} />;
}
