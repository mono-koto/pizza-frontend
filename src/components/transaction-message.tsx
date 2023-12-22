import { ReactNode } from "react";
import BlockscannerLink from "./blockscanner-link";

export default function TransactionMessage({
  children,
  transactionHash,
}: {
  children: ReactNode;
  transactionHash?: string;
}) {
  return (
    <div>
      <div>{children}</div>
      {transactionHash && (
        <BlockscannerLink kind='transaction' address={transactionHash} />
      )}
    </div>
  );
}
