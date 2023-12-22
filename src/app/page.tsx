import RecentSplitters from "@/components/recent-splitters";

import Link from "next/link";

export default function Home() {
  return (
    <div className='flex flex-col md:flex-row gap-6 '>
      <div className='prose dark:prose-invert w-1/2'>
        <h3>Grab your slice!</h3>
        <p>
          Split.Pizza is a web3 protocol for fairly and transparently allocating
          funds among multiple recipients.
        </p>
        <p>
          When someone sends tokens or ETH to a splitter, the value can only
          release only according to the portions you've predefined.
        </p>
        <p>
          Of course, some great{" "}
          <Link href='https://docs.openzeppelin.com/contracts/4.x/api/finance#PaymentSplitter'>
            Payment
          </Link>{" "}
          <Link href='https://splits.org/'>Splitters</Link> already exist! But
          the Split.Pizza dApp is gas-optimized for smaller recipient groups,
          has a super easy UI, and we've added a few special features
          specifically for PYUSD!
        </p>
        <p>
          <Link href='/new' prefetch>
            Create a Splitter
          </Link>{" "}
          and dig in!
        </p>
      </div>

      <div className='w-1/2'>
        <RecentSplitters />
      </div>
    </div>
  );
}
