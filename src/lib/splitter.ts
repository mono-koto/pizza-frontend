import { AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { Address } from "viem";
import { alchemyClient } from "./alchemy";

export async function getSplitterAssetTransfers({
  address,
  chainId,
}: {
  address: Address;
  chainId: number;
}) {
  const alchemy = alchemyClient(chainId);
  // TODO - for large numbers of transfers, we need to paginate
  // rather than just taking the first page of each
  const inbound = alchemy.core.getAssetTransfers({
    toAddress: address,
    category: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
    ],
    order: SortingOrder.DESCENDING,
  });
  const outbound = alchemy.core.getAssetTransfers({
    fromAddress: address,
    category: [AssetTransfersCategory.INTERNAL, AssetTransfersCategory.ERC20],
    order: SortingOrder.DESCENDING,
  });
  const [inboundEvents, outboundEvents] = await Promise.all([
    inbound,
    outbound,
  ]);

  return [...inboundEvents.transfers, ...outboundEvents.transfers].sort(
    (a, b) => Number(a.blockNum) - Number(b.blockNum)
  );
}
