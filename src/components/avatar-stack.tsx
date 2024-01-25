import { Address } from "viem";
import CustomAvatar from "./custom-avatar";

export default function AvatarStack({
  addresses,
  size = 16,
}: {
  addresses: readonly Address[];
  size?: number;
}) {
  return (
    <div className='flex flex-row items-center gap-1'>
      <div className={"inline-block"} style={{ marginLeft: `${size / 2}px` }}>
        {addresses.map((p, i) => (
          <CustomAvatar
            key={p}
            address={p}
            tooltip
            className={"inline-block grow-0"}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${-size / 2}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
