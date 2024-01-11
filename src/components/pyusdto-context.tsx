import Image from "next/image";
import Link from "next/link";
import BlockscannerLink from "./blockscanner-link";

export default function PyusdToContext({
  nickname,
  address,
}: {
  nickname: string;
  address: string;
}) {
  return (
    <span>
      <Image
        src='/heartpyusd.svg'
        width={20}
        height={20}
        alt='PYUSD.to icon'
        className='inline-block mr-1'
      />
      <Link
        href={`https://pyusd.to/${address}`}
        target='_blank'
        className='text-foreground hover:underline'
      >
        pyusd.to/{nickname}
      </Link>{" "}
      is a shortcut for <BlockscannerLink address={address} kind='address' />
    </span>
  );
}
