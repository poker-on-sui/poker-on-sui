'use client'
import React from 'react'
import Image from 'next/image'

import GameControls from './GameControls'
import OnTableStatus from './OnTableStatus'
import Players from './Players'
import tablePng from '~/assets/table.png'
import { eightPlayersFullTable } from '~/lib/mock/game-state.mock'
import iconPng from '~/app/icon.png'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'
// import { useGameTable } from '~/lib/hooks/useGameTable'

interface Props {
  readonly gameAddress?: string
}

export default function GameTable({}: Props) {
  // const { game, isLoading } = useGameTable(gameAddress)
  const game = eightPlayersFullTable
  const isLoading = false // Simulating loading state for the example

  return (
    <div className='h-full w-full relative grid grid-cols-1 grid-rows-1 *:col-start-1 *:row-start-1'>
      {/* Header with logo, heading and slogan */}
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center pt-6 pb-4'>
        <Image
          src={iconPng}
          alt='Poker on SUI'
          className='drop-shadow-2xl size-[80px]'
          priority
        />
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
        {/* Game content will go here */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <OnTableStatus game={game} loading={isLoading} />
        </div>
      </div>
      <div className='absolute bottom-0 left-0 right-0 w-full z-10'>
        <GameControls game={game} loading={isLoading} />
      </div>
    </div>
  )
}
