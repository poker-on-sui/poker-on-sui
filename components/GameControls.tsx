'use client'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useGameActions } from '~/lib/hooks/useGameActions'
import { GameState } from '~/lib/models/GameState'

interface Props {
  readonly game?: GameState
  readonly loading?: boolean
}

export default function GameControls({ game, loading }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(0)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const actions = useGameActions(game?.id)

  if (loading) {
    return (
      <div className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'>
        <div className='flex items-center justify-center'>
          <div className='text-white'>Loading game controls...</div>
        </div>
      </div>
    )
  }

  // Show "no game loaded" state when gameAddress is empty or undefined
  if (!game) {
    return (
      <div className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'>
        <div className='flex items-center justify-center'>
          <div className='text-center text-gray-400'>
            <div className='text-lg font-medium mb-2'>No Game Loaded</div>
            <div className='text-sm'>Join or create a game to see controls</div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlayer = game.players[game.currentPlayer]
  const isMyTurn = currentPlayer?.isActive && !currentPlayer?.isFolded
  const callAmount = game.currentBet - (currentPlayer?.currentBet || 0)
  const minRaise = game.currentBet > 0 ? game.currentBet * 2 : game.bigBlind
  const maxRaise = currentPlayer?.chips || 0

  const handleRaise = () => {
    const amount = raiseAmount || parseInt(customBetAmount) || minRaise
    if (amount >= minRaise && amount <= maxRaise) {
      actions.raise(amount)
      setRaiseAmount(0)
      setCustomBetAmount('')
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaiseAmount(parseInt(e.target.value))
    setCustomBetAmount('')
  }

  const handleCustomBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBetAmount(e.target.value)
    setRaiseAmount(0)
  }

  return (
    <div className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'>
      <div className='space-y-4'>
        {/* Action Buttons */}
        <div className='flex gap-3'>
          <Button
            variant='destructive'
            size='lg'
            onClick={actions.fold}
            disabled={!isMyTurn}
            className='flex-1 h-12 text-lg font-bold'
          >
            Fold
          </Button>

          {callAmount > 0 ? (
            <Button
              variant='outline'
              size='lg'
              onClick={actions.call}
              disabled={!isMyTurn || callAmount > (currentPlayer?.chips || 0)}
              className='flex-1 h-12 text-lg font-bold border-blue-500 text-blue-400 hover:bg-blue-500/20'
            >
              Call ${callAmount}
            </Button>
          ) : (
            <Button
              variant='outline'
              size='lg'
              onClick={actions.call}
              disabled={!isMyTurn}
              className='flex-1 h-12 text-lg font-bold border-green-500 text-green-400 hover:bg-green-500/20'
            >
              Check
            </Button>
          )}

          <Button
            variant='default'
            size='lg'
            onClick={handleRaise}
            disabled={!isMyTurn || maxRaise < minRaise}
            className='flex-1 h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white'
          >
            {game.currentBet > 0 ? 'Raise' : 'Bet'}
          </Button>
        </div>

        {/* Raise Amount Controls */}
        {isMyTurn && maxRaise >= minRaise && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between text-sm text-gray-400'>
              <span>Min: ${minRaise}</span>
              <span>Max: ${maxRaise}</span>
            </div>

            {/* Raise Slider */}
            <div className='space-y-2'>
              <input
                type='range'
                min={minRaise}
                max={maxRaise}
                value={raiseAmount || minRaise}
                onChange={handleSliderChange}
                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                    ((raiseAmount || minRaise - minRaise) /
                      (maxRaise - minRaise)) *
                    100
                  }%, #374151 ${
                    ((raiseAmount || minRaise - minRaise) /
                      (maxRaise - minRaise)) *
                    100
                  }%, #374151 100%)`,
                }}
              />
              {raiseAmount > 0 && (
                <div className='text-center text-white font-medium'>
                  ${raiseAmount}
                </div>
              )}
            </div>

            {/* Custom Bet Input */}
            <div className='flex gap-2 items-center'>
              <Input
                type='number'
                placeholder={`Custom amount (${minRaise}-${maxRaise})`}
                value={customBetAmount}
                onChange={handleCustomBetChange}
                min={minRaise}
                max={maxRaise}
                className='flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
              />
            </div>

            {/* Quick Bet Buttons */}
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setRaiseAmount(minRaise)
                  setCustomBetAmount('')
                }}
                className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
              >
                Min
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setRaiseAmount(Math.floor(game.pot / 2))
                  setCustomBetAmount('')
                }}
                className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
              >
                1/2 Pot
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setRaiseAmount(game.pot)
                  setCustomBetAmount('')
                }}
                className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
              >
                Pot
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setRaiseAmount(maxRaise)
                  setCustomBetAmount('')
                }}
                className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
              >
                All-In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for custom slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
