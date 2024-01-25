import RecentSplitters from "@/components/recent-splitters";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";

import Link from "next/link";

export const revalidate = 60; // revalidate at most every minute

export default function Home() {
  return (
    <div className='flex flex-col md:flex-row gap-6 '>
      <div className='prose dark:prose-invert w-1/2'>
        <h3>🍕 Grab your slice!</h3>
        <p>
          PYUSD.pizza is a simple Ethereum protocol for fairly and transparently
          allocating funds among multiple recipients.
        </p>
        <p>
          When someone sends PYUSD or ETH or any other tokens to a splitter, the
          value can only release according to the predefined portions.
        </p>

        <p>Let&apos;s dig in!</p>
        <p>
          <Link href='/new' prefetch passHref>
            <Button size='lg' className='text-xl uppercase px-4'>
              <Pizza className='w-6 h-6 mr-2' />
              Make A Pizza
            </Button>
          </Link>
          <br />
          <span className='text-xs text-muted-foreground'>
            (aka an immutable payment splitter smart contract!)
          </span>
        </p>
      </div>
      <div className='w-1/2'>
        <RecentSplitters />
      </div>
    </div>
  );
}
