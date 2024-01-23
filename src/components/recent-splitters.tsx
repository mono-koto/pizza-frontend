"use client";

import { getRecentSplitterCreations } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { useChainId, usePublicClient } from "wagmi";
import SplitterListItem from "./splitter-list-item";
import getConfig from "@/lib/config";

export default function RecentSplitters() {
  const client = usePublicClient();
  const chainId = useChainId();

  const splitterCreationsQuery = useQuery({
    queryKey: [chainId, "recent-splitters"],
    queryFn: () =>
      getRecentSplitterCreations({
        chainId: chainId,
        token: getConfig(chainId).preferredToken,
      }),
  });

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-xl font-bold'>👩‍🍳 Recent splitters</h3>
      {splitterCreationsQuery.isLoading && <span>Loading...</span>}
      {splitterCreationsQuery.data?.length === 0 && <span>None yet!</span>}

      {splitterCreationsQuery.data?.map((splitterCreation) => (
        <SplitterListItem
          key={splitterCreation.address}
          {...splitterCreation}
        />
      ))}
    </div>
  );
}
