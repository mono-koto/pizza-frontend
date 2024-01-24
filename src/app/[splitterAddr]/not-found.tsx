import { Cookie } from "lucide-react";

export default async function NotFound() {
  return (
    <div className='flex h-full flex-1 flex-col items-center justify-center gap-3 opacity-40 md:min-h-[200px]'>
      <Cookie />
      <div className='flex flex-col gap-4'>
        <div>Splitter not found. Maybe it&apos;s on another chain?</div>
      </div>
    </div>
  );
}
