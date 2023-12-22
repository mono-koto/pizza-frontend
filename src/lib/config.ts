import { chainConfig } from "@/config";

export default function getConfig(chainId: number) {
  return chainConfig[chainId as keyof typeof chainConfig];
}
