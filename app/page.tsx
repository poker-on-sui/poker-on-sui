import React from 'react'
import Image from 'next/image'

import GameLobby from '~/components/GameLobby'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'
import iconPng from './icon.png'

export default function HomePage() {
  return (
    <div className='min-h-screen flex flex-1 flex-col items-center justify-center'>
      <Image
        src={iconPng}
        alt='Poker on SUI'
        className='drop-shadow-2xl size-[320px]'
        priority
      />
      <h1 className='text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow'>
        {en.home.title}
      </h1>
      <div className='mb-8 flex items-center justify-center opacity-80'>
        <span className='text-white italic'>All-in-</span>
        <Image
          src={suiIconSvg}
          alt='SUI'
          unoptimized
          className='opacity-80 w-[12px] h-[16px]'
        />
      </div>
      <GameLobby />
    </div>
  )
}
