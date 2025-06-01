'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

import GameControls from './GameControls'
import OnTableStatus from './OnTableStatus'
import Players from './Players'
import tablePng from '~/assets/table.png'
import * as mocks from '~/lib/mock/game-state.mock'
import iconPng from '~/app/icon.png'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'
import { CommunityCards } from './CommunityCards'
import { useAccounts } from '@mysten/dapp-kit'
import WalletConnectionPrompt from './WalletConnectionPrompt'
// import { useGameTable } from '~/lib/hooks/useGameTable'

interface Props {
  readonly gameAddress?: string
}

export default function GameTable({}: Props) {
  const [account] = useAccounts()
  // const { game, isLoading } = useGameTable(gameAddress)
  const game = mocks.flopFourPlayersWithBetting
  const isLoading = false // Simulating loading state for the example

  return !account ? (
    <WalletConnectionPrompt size="large" />
  ) : (
    <div className='h-full w-full relative grid grid-cols-1 grid-rows-1 *:col-start-1 *:row-start-1'>
      {/* Header with logo, heading and slogan */}
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center pt-6 pb-4'>
        <motion.div
          layoutId="poker-icon"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={iconPng}
            alt='Poker on SUI'
            className='drop-shadow-2xl size-[80px]'
            priority
          />
        </motion.div>
        <h1 className='text-xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow'>
          {en.home.title}
        </h1>
        <div className='flex items-center justify-center opacity-80'>
          <span className='text-white italic text-sm'>All-in-</span>
          <Image
            src={suiIconSvg}
            alt='SUI'
            unoptimized
            className='opacity-80 w-[8px] h-[10px]'
          />
        </div>
      </div>

      {/* The Table */}
      <div className='w-full max-w-[920px] aspect-[1391px/658px] place-self-center relative -top-20'>
        <Image
          src={tablePng}
          alt='Poker Table'
          className='w-full h-full object-cover'
          priority
        />
        {/* Players positioned around the table */}
        <Players
          players={game?.players || []}
          currentPlayerId={game?.players?.find(p => p.isActive)?.id}
        />
        <CommunityCards cards={game.communityCards} />
        {/* Game content will go here */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <OnTableStatus
            game={game}
            loading={isLoading}
            address={account?.address}
          />
        </div>
      </div>
      <div className='absolute bottom-0 left-0 right-0 w-full z-10'>
        <GameControls
          game={game}
          loading={isLoading}
          address={account?.address}
        />
      </div>
    </div>
  )
}
