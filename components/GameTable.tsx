'use client'
import React from 'react'
import Image from 'next/image'
import tablePng from '~/assets/table.png'

import { useGame } from '~/lib/hooks/useGame'
import GameControls from './GameControls'
import OnTableStatus from './OnTableStatus'

interface Props {
  readonly gameAddress?: string
}

export default function GameTable({ gameAddress }: Props) {
  const {} = useGame(gameAddress) // TODO: Implement game logic and state management

  return (
    <div className='h-full w-full relative'>
      {/* Background image */}
      <div className='absolute left-0 top-20 z-0 w-full'>
        <Image
          src={tablePng}
          alt='Poker Table'
          sizes='100vw'
          className='w-full h-auto object-cover'
          priority
        />
        {/* Game content will go here */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <OnTableStatus gameAddress={gameAddress} />
        </div>
      </div>
      <div className='absolute bottom-0 left-0 right-0 w-full z-10'>
        <GameControls gameAddress={gameAddress} />
      </div>
    </div>
  )
}
