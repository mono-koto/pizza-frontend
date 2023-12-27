"use client";

import { getRecentSplitterCreations } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import SplitterListItem from "./splitter-list-item";

export default function RecentSplitters() {
  const client = usePublicClient();

  const splitterCreationsQuery = useQuery({
    queryKey: [client.chain.id, "recent-splitters"],
    queryFn: () =>
      getRecentSplitterCreations({
        chainId: client.chain.id,
        token: "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
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
