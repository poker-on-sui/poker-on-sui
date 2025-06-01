'use client'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

import { en } from '~/lib/dictionaries'
import { useGameLobby } from '~/lib/hooks/useGameLobby'

export default function GameLobby() {
  const {
    gameAddress,
    joinError,
    createError,
    handleAddressChange,
    handleCreateGame,
    handleJoinGame,
  } = useGameLobby()
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleCreateGame}
          className="cursor-pointer  w-full py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-green-400 hover:to-emerald-600 transition drop-shadow-glow"
        >
          {en.lobby.host}
        </Button>
        {createError && (
          <div className="text-red-400 text-sm mt-1 px-1">{createError}</div>
        )}
      </div>
      <hr className="border-t border-cyan-700/50" />
      <form
        className="flex flex-col gap-2"
        onSubmit={e => (e.preventDefault(), handleJoinGame())}
      >
        <Input
          type="text"
          placeholder="Enter Game Address"
          value={gameAddress}
          onChange={handleAddressChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-cyan-400 ${
            joinError
              ? 'border-red-500 bg-red-950/20 text-red-200 focus:ring-red-400'
              : 'border-cyan-700 bg-[#1a2634] text-cyan-200 focus:ring-cyan-400'
          }`}
        />
        {joinError && (
          <div className="text-red-400 text-sm mt-1 px-1">{joinError}</div>
        )}
        <Button
          type="submit"
          disabled={!gameAddress.trim()}
          className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-blue-500 hover:to-purple-600 transition drop-shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {en.lobby.join}
        </Button>
      </form>
    </div>
  )
}
