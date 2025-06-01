'use client'
import React from 'react'
import Image from 'next/image'

import GameControls from './GameControls'
import OnTableStatus from './OnTableStatus'
import Players from './Players'
import tablePng from '~/assets/table.png'
import { eightPlayersFullTable } from '~/lib/mock/game-state.mock'
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
