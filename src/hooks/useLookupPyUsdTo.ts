import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";

export const useLookupPyUsdTo = (nicknameOrAddress?: string) => {
  const input = nicknameOrAddress?.replace(
    /^(?:http(?:s)?:\/\/)?pyusd.to\//i,
    ""
  );

  const inputIsENS = input?.toLowerCase().endsWith(".eth");
  const inputIsAddress = input && isAddress(input);
  return useQuery({
    queryKey: ["getPYUSDTOLookup", input],
    queryFn: async () => {
      if (inputIsENS || inputIsAddress) {
        throw new Error("Not a PYUSD.to nickname");
      }

      const res = await fetch(`https://pyusd.to/api/${input}`);

      if (!res.ok) {
        console.error(res.body);
        throw new Error("Error fetching from PYUSD.to:" + res.status);
      }
      return res.json();
    },
    enabled: Boolean(input) && !inputIsENS && !inputIsAddress,
  });
};
