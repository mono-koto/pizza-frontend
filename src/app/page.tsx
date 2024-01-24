import RecentSplitters from "@/components/recent-splitters";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";

import Link from "next/link";

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
          value can only release only according to the portions you&apos;ve
          predefined.
        </p>
        <p>
          Of course, some great{" "}
          <Link href='https://docs.openzeppelin.com/contracts/4.x/api/finance#PaymentSplitter'>
            Payment
          </Link>{" "}
          <Link href='https://splits.org/'>Splitters</Link> already exist! But
          the Split.Pizza dApp is designed for small recipient groups, prefers
          (but is not limited to!) PYUSD, and has a fun UI that integrates with{" "}
          <Link href='https://PYUSD.to/'>PYUSD.to</Link>.
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
