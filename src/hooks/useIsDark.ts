import { useIsMounted } from "usehooks-ts";
import { usePrefersDark } from "./usePrefersDark";
import { useTheme } from "next-themes";

export default function useIsDark() {
  const { theme } = useTheme();
  const prefersDark = usePrefersDark();
  const isMounted = useIsMounted();
  return (
    isMounted() && (theme === "dark" || (theme === "system" && prefersDark))
  );
}
