"use client";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { localhost, mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import CustomAvatar from "./custom-avatar";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [sepolia, localhost]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "PYUSD.to",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

function ClientProviders({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  /// hack to move theme to client to avoid hydration mismatch
  const [thirdPartyTheme, setThirdPartyTheme] = useState<"dark" | "light">(
    "light"
  );
  useEffect(() => {
    if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)")) {
        setThirdPartyTheme("dark");
      } else {
        setThirdPartyTheme("light");
      }
    } else if (theme === "dark" || theme === "light") {
      setThirdPartyTheme(theme);
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          avatar={CustomAvatar}
          theme={thirdPartyTheme === "dark" ? darkTheme() : lightTheme()}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default ClientProviders;
