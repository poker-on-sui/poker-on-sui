'use client'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

import { en } from '~/lib/dictionaries'
import { useGameLobby } from '~/lib/hooks/useGameLobby'

export default function GameLobby() {
  const {
    createGame,
    joinGame,
    gameAddress,
    addressError,
    handleAddressChange,
  } = useGameLobby()
  return (
    <div className='flex flex-col gap-6 w-full max-w-xs'>
      <Button
        onClick={createGame}
        className='cursor-pointer  w-full py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-green-400 hover:to-emerald-600 transition drop-shadow-glow'
      >
        {en.lobby.host}
      </Button>
      <hr className='border-t border-cyan-700/50' />
      <div className='flex flex-col gap-2'>
        <Input
          type='text'
          placeholder='Enter Game Address'
          value={gameAddress}
          onChange={handleAddressChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-cyan-400 ${
            addressError
              ? 'border-red-500 bg-red-950/20 text-red-200 focus:ring-red-400'
              : 'border-cyan-700 bg-[#1a2634] text-cyan-200 focus:ring-cyan-400'
          }`}
        />
        {addressError && (
          <div className='text-red-400 text-sm mt-1 px-1'>{addressError}</div>
        )}
        <Button
          onClick={joinGame}
          disabled={!gameAddress.trim()}
          className='cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-blue-500 hover:to-purple-600 transition drop-shadow-glow disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {en.lobby.join}
        </Button>
      </div>
    </div>
  )
}
