'use client'

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networkConfig } from '~/lib/networkConfig'

const queryClient = new QueryClient()

interface Props {
  readonly children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
