import { en } from '~/lib/dictionaries'
import GameRules from './GameRules'
import { Button } from './ui/button'

interface Props {
  readonly children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className='h-full w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] relative'>
      {/* Top bar */}
      <div className='fixed top-0 left-0 right-0 w-full flex justify-between items-center p-4'>
        {/* Help icon */}
        <GameRules />
        {/* Connect Wallet placeholder */}
        <Button className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-700 rounded shadow text-white font-semibold hover:from-cyan-400 hover:to-blue-600 transition drop-shadow-glow'>
          {en.header.connectWallet}
        </Button>
      </div>
      <main className='w-full h-full'>{children}</main>
    </div>
  )
}
