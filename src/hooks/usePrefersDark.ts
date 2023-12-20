import { useEffect, useMemo, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { Address, getAddress, isAddress } from "viem";
import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";

export const usePrefersDark = () => {
  const [prefersDark, setPrefersDark] = useState(false);
  useEffect(() => {
    setPrefersDark(
      Boolean(
        typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)")
      )
    );
  }, []);
  return prefersDark;
};
