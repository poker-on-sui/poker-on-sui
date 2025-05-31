'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'
import GameLobby from '../components/GameLobby'
import GameRules from '../components/GameRules'
import { en } from '~/lib/dictionaries'

export default function HomePage() {
  const router = useRouter()

  const handleHostGame = () => {
    // For now, redirect to game page without address (could show a "create game" flow)
    router.push('/game')
  }

  const handleJoinGame = (gameAddress: string) => {
    // Navigate to game page with address as search parameter
    router.push(`/game?addr=${encodeURIComponent(gameAddress)}`)
  }
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] relative'>
      {/* Top bar */}
      <div className='flex justify-between items-center p-4'>
        {/* Help icon */}
        <GameRules />
        {/* Connect Wallet placeholder */}
        <Button className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-700 rounded shadow text-white font-semibold hover:from-cyan-400 hover:to-blue-600 transition drop-shadow-glow'>
          {en.header.connectWallet}
        </Button>
      </div>

      {/* Main content */}
      <div className='flex flex-1 flex-col items-center justify-center'>
        {/* Hero Image */}

        <Image
          src='/icon.png'
          alt='Poker on SUI'
          width={320}
          height={320}
          className='drop-shadow-2xl'
          priority
        />
        <h1 className='text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow'>
          {en.home.title}
        </h1>
        <div className='mb-8 flex items-center justify-center opacity-80'>
          <span className='text-white italic'>All-in-</span>
          <Image
            src='/Sui_Symbol_White.svg'
            alt='SUI'
            width={12}
            height={16}
            unoptimized
            className='opacity-80 w-[12px] h-[16px]'
          />
        </div>
        <GameLobby onHostGame={handleHostGame} onJoinGame={handleJoinGame} />
      </div>
    </div>
  )
}
