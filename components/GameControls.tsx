'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useGameActions } from '~/lib/hooks/useGameActions'
import { GameState } from '~/lib/models/GameState'

interface Props {
  readonly game?: GameState
  readonly loading?: boolean
  /** Current connected wallet address */
  readonly address?: string
}

export default function GameControls({ game, loading, address }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(0)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const actions = useGameActions(game?.id)

  const currentPlayer = !game ? undefined : game.players[game.currentPlayer]
  const isMyTurn = !currentPlayer ? false : currentPlayer.id === address
  const callAmount = !game
    ? 0
    : game.currentBet - (currentPlayer?.currentBet || 0)
  const minRaise = !game
    ? 0
    : game.currentBet > 0
    ? game.currentBet * 2
    : game.bigBlind
  const maxRaise = currentPlayer?.chips || 0

  // Debugging information
  useEffect(() => {
    console.log('Current Game:', game)
    console.log('Current Player:', currentPlayer)
    console.log('My Address:', address)
    console.log('Is My Turn:', isMyTurn)
    console.log('Call Amount:', callAmount)
    console.log('Min Raise:', minRaise)
    console.log('Max Raise:', maxRaise)
    console.log('Raise Amount:', raiseAmount)
    console.log('Custom Bet Amount:', customBetAmount)
  }, [
    game,
    address,
    currentPlayer,
    isMyTurn,
    callAmount,
    minRaise,
    maxRaise,
    raiseAmount,
    customBetAmount,
    actions.fold,
    actions.call,
    actions.raise,
    loading,
  ])

  if (loading) {
    return (
      <motion.div
        className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex items-center justify-center'>
          <motion.div
            className='text-white'
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading game controls...
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Show "no game loaded" state when gameAddress is empty or undefined
  if (!game) {
    return (
      <motion.div
        className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex items-center justify-center'>
          <div className='text-center text-gray-400'>
            <div className='text-lg font-medium mb-2'>No Game Loaded</div>
            <div className='text-sm'>Join or create a game to see controls</div>
          </div>
        </div>
      </motion.div>
    )
  }

  // useEffect(() => {
  //   if (game) {
  //     console.log('Game State:', game)
  //   }
  // }, [game])

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
    <motion.div
      className='bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl'
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className='space-y-4'>
        {/* Action Buttons */}
        <motion.div
          className='flex gap-3'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className='flex-1'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant='destructive'
              size='lg'
              onClick={actions.fold}
              disabled={!isMyTurn}
              className='w-full h-12 text-lg font-bold'
            >
              Fold
            </Button>
          </motion.div>

          <motion.div
            className='flex-1'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {callAmount > 0 ? (
              <Button
                variant='outline'
                size='lg'
                onClick={actions.call}
                disabled={!isMyTurn || callAmount > (currentPlayer?.chips || 0)}
                className='w-full h-12 text-lg font-bold border-blue-500 text-blue-400 hover:bg-blue-500/20'
              >
                Call ${callAmount}
              </Button>
            ) : (
              <Button
                variant='outline'
                size='lg'
                onClick={actions.call}
                disabled={!isMyTurn}
                className='w-full h-12 text-lg font-bold border-green-500 text-green-400 hover:bg-green-500/20'
              >
                Check
              </Button>
            )}
          </motion.div>

          <motion.div
            className='flex-1'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant='default'
              size='lg'
              onClick={handleRaise}
              disabled={!isMyTurn || maxRaise < minRaise}
              className='w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white'
            >
              {game.currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Raise Amount Controls */}
        <AnimatePresence>
          {isMyTurn && maxRaise >= minRaise && (
            <motion.div
              className='space-y-3'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
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
                  <motion.div
                    className='text-center text-white font-medium'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${raiseAmount}
                  </motion.div>
                )}
              </div>

              {/* Custom Bet Input */}
              <motion.div
                className='flex gap-2 items-center'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Input
                  type='number'
                  placeholder={`Custom amount (${minRaise}-${maxRaise})`}
                  value={customBetAmount}
                  onChange={handleCustomBetChange}
                  min={minRaise}
                  max={maxRaise}
                  className='flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
                />
              </motion.div>

              {/* Quick Bet Buttons */}
              <motion.div
                className='flex gap-2'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {[
                  { label: 'Min', value: minRaise },
                  { label: '1/2 Pot', value: Math.floor(game.pot / 2) },
                  { label: 'Pot', value: game.pot },
                  { label: 'All-In', value: maxRaise },
                ].map((btn, index) => (
                  <motion.div
                    key={btn.label}
                    className='flex-1'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setRaiseAmount(btn.value)
                        setCustomBetAmount('')
                      }}
                      className='w-full border-gray-600 text-gray-300 hover:bg-gray-700'
                    >
                      {btn.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.div>
  )
}
