'use client'
import React from 'react'
import { en } from '~/lib/dictionaries'
import { GameState } from '~/lib/models/GameState'

interface Props {
  readonly game?: GameState | null
}

export default function OnTableStatus({ game }: Props) {
  if (!game) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='text-white text-lg mb-2'>{en.game.noGameLoaded}</div>
          <div className='text-gray-400 text-sm'>
            {en.game.joinOrCreateGame}
          </div>
        </div>
      </div>
    )
  }

  if (game.status === 'loading') {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-white'>{en.game.loadingGame}</div>
      </div>
    )
  }

  const currentPlayer = game.players[game.activePlayerPosition]
  const isMyTurn = currentPlayer?.isActive && !currentPlayer?.isFolded

  return (
    <div className='space-y-4'>
      {/* Game Info */}
      <div className='flex justify-between items-center text-white'>
        <div className='text-sm'>
          <span className='text-gray-400'>{en.game.pot}</span>{' '}
          <span className='font-bold text-green-400'>${game.pot}</span>
        </div>
        <div className='text-sm'>
          <span className='text-gray-400'>{en.game.currentBet}</span>{' '}
          <span className='font-bold text-yellow-400'>${game.currentBet}</span>
        </div>
        <div className='text-sm'>
          <span className='text-gray-400'>{en.game.yourChips}</span>{' '}
          <span className='font-bold text-blue-400'>
            ${currentPlayer?.chips || 0}
          </span>
        </div>
      </div>

      {/* Player Status */}
      <div className='text-center'>
        {!isMyTurn ? (
          <div className='text-gray-400 text-sm'>
            {en.game.waitingFor} {currentPlayer?.name || en.game.otherPlayer}...
          </div>
        ) : (
          <div className='text-green-400 text-sm font-medium'>
            {en.game.yourTurn} {currentPlayer?.name}
          </div>
        )}
      </div>

      {/* Game Phase Indicator */}
      <div className='text-center'>
        <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30'>
          <span className='text-blue-400 text-sm font-medium capitalize'>
            {game.status} {en.game.round}
          </span>
        </div>
      </div>
    </div>
  )
}
