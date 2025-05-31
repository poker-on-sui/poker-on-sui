'use client'
import React from 'react'
import { en } from '~/lib/dictionaries'
import { GameState } from '~/lib/models/GameState'
import { PokerGameState } from '~/lib/models/MovePokerGameSchema'
import { cn } from '~/lib/utils'

interface Props {
  readonly game?: GameState
  loading?: boolean
}

// Helper function to get phase-specific styling
function getPhaseStyles(status: PokerGameState) {
  switch (status) {
    case PokerGameState.WAITING_FOR_PLAYERS:
      return {
        bg: 'bg-gray-600/20',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
      }
    case PokerGameState.PRE_FLOP:
      return {
        bg: 'bg-purple-600/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
      }
    case PokerGameState.FLOP:
      return {
        bg: 'bg-blue-600/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      }
    case PokerGameState.TURN:
      return {
        bg: 'bg-orange-600/20',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
      }
    case PokerGameState.RIVER:
      return {
        bg: 'bg-red-600/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
      }
    case PokerGameState.SHOWDOWN:
      return {
        bg: 'bg-yellow-600/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
      }
    case PokerGameState.GAME_OVER:
      return {
        bg: 'bg-green-600/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
      }
    default:
      return {
        bg: 'bg-gray-600/20',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
      }
  }
}

export default function OnTableStatus({ game, loading }: Props) {
  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-white'>{en.game.loadingGame}</div>
      </div>
    )
  }

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

  const currentPlayer = game.players[game.currentPlayer]
  const isMyTurn = currentPlayer?.isActive && !currentPlayer?.isFolded

  return (
    <div className='space-y-4'>
      {/* Game Info */}
      {game.status !== PokerGameState.WAITING_FOR_PLAYERS && (
        <div className='flex justify-between items-center text-white'>
          <div className='text-sm'>
            <span className='text-gray-400'>{en.game.pot}</span>{' '}
            <span className='font-bold text-green-400'>${game.pot}</span>
          </div>
          <div className='text-sm'>
            <span className='text-gray-400'>{en.game.currentBet}</span>{' '}
            <span className='font-bold text-yellow-400'>
              ${game.currentBet}
            </span>
          </div>
          <div className='text-sm'>
            <span className='text-gray-400'>{en.game.yourChips}</span>{' '}
            <span className='font-bold text-blue-400'>
              ${currentPlayer?.chips || 0}
            </span>
          </div>
        </div>
      )}

      {/* Player Status */}
      {game.status !== PokerGameState.WAITING_FOR_PLAYERS && (
        <div className='text-center'>
          {!isMyTurn ? (
            <div className='text-gray-400 text-sm'>
              {en.game.waitingFor} {currentPlayer?.name || en.game.otherPlayer}
              ...
            </div>
          ) : (
            <div className='text-green-400 text-sm font-medium'>
              {en.game.yourTurn} {currentPlayer?.name}
            </div>
          )}
        </div>
      )}

      {/* Game Phase Indicator */}
      <div className='text-center'>
        {(() => {
          const phaseStyles = getPhaseStyles(game.status)
          return (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${phaseStyles.bg} border ${phaseStyles.border}`}
            >
              <span className={cn(phaseStyles.text, 'text-sm font-medium')}>
                {game.status === PokerGameState.PRE_FLOP
                  ? en.game.status.preFlop
                  : game.status === PokerGameState.FLOP
                  ? en.game.status.flop
                  : game.status === PokerGameState.TURN
                  ? en.game.status.turn
                  : game.status === PokerGameState.RIVER
                  ? en.game.status.river
                  : game.status === PokerGameState.SHOWDOWN
                  ? en.game.status.showdown
                  : game.status === PokerGameState.GAME_OVER
                  ? en.game.status.finished
                  : en.game.status.waitingForPlayers}
              </span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
