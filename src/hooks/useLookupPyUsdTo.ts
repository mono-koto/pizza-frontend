import { useQuery } from "@tanstack/react-query";

export const useLookupPyUsdTo = (nicknameOrAddress?: string) => {
  const input = nicknameOrAddress?.replace(
    /^(?:http(?:s)?:\/\/)?pyusd.to\//i,
    ""
  );
  return useQuery({
    queryKey: ["getPYUSDTOLookup", input],
    queryFn: async () => {
      const res = await fetch(`https://pyusd.to/api/${input}`);
      console.log(res);
      if (!res.ok)
        throw new Error("Error fetching from PYUSD.to:" + res.status);
      return res.json();
    },
    enabled: Boolean(input),
  });
};
