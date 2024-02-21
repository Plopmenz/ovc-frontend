"use client"

import "@rainbow-me/rainbowkit/styles.css"

import {
  darkTheme,
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import { http, WagmiProvider } from "wagmi"
import { polygonMumbai } from "wagmi/chains"

import { siteConfig } from "@/config/site"

export const chains = [polygonMumbai] as const
export const defaultChain = polygonMumbai

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "https://ovc.plopmenz.com/icon.png" as const
const appUrl = "https://ovc.plopmenz.com" as const
const projectId = "0ec5e8af894898c29bc27a1c4dc11e78" as const // WalletConnect

const config = getDefaultConfig({
  appName: appName,
  projectId: projectId,
  appDescription: appDescription,
  appIcon: appIcon,
  appUrl: appUrl,
  chains: chains,
  transports: {
    [polygonMumbai.id]: http(),
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const { resolvedTheme } = useTheme()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={defaultChain}
          theme={resolvedTheme == "light" ? lightTheme() : darkTheme()}
          appInfo={{
            appName: appName,
            learnMoreUrl: appUrl,
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
