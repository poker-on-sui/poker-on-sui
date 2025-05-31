'use client'
import GameRules from './GameRules'
import AppProviders from './AppProviders'

import { ConnectButton } from '@mysten/dapp-kit'

interface Props {
  readonly children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <AppProviders>
      <div className='h-full w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] relative'>
        {/* Top bar */}
        <div className='fixed top-0 left-0 right-0 w-full flex justify-between items-center p-4 z-20'>
          {/* Help icon */}
          <GameRules />
          {/* Wallet Status */}
          <ConnectButton />
        </div>
        <main className='w-full h-full'>{children}</main>
      </div>
    </AppProviders>
  )
}
