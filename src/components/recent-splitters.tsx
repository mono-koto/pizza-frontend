"use client";

import { useRecentSplitters } from "@/hooks/useRecentSplitters";
import SplitterListItem from "./splitter-list-item";

export default function RecentSplitters() {
  const splitterCreationsQuery = useRecentSplitters();

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
