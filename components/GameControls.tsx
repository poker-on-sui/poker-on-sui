'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Slider } from '~/components/ui/slider'
import { formatMist } from '~/lib/format-mist'
import { SuiIcon } from './SuiIcon'
import { en } from '~/lib/dictionaries'
import { PokerGameState } from '~/lib/models/MovePokerGameSchema'
import { useGameControl } from '~/lib/hooks/useGameControl'
import { useGameInfoQuery } from '~/lib/queries/getGameInfo'

interface Props {
  gameAddr: string | undefined
  /** Current connected wallet address */
  readonly address?: string
}

export default function GameControls({ gameAddr, address }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(0)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const { data: game, isLoading: loadingGame } = useGameInfoQuery(gameAddr)

  const {
    handleCall,
    handleCheck,
    handleFold,
    // _handleBet,
    handleRaise: _handleRaise,
    loading: takingAction,
  } = useGameControl(gameAddr)

  const isWaiting = !!game && game.status === PokerGameState.WAITING_FOR_PLAYERS
  const isGameOver = !!game && game.status === PokerGameState.GAME_OVER
  const currentPlayer =
    !game || isWaiting || isGameOver
      ? undefined
      : game.players[game.currentPlayer]
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
  ])

  const handleRaise = useCallback(() => {
    const amount = raiseAmount || parseInt(customBetAmount) || minRaise
    if (amount >= minRaise && amount <= maxRaise) {
      _handleRaise(amount)
      setRaiseAmount(0)
      setCustomBetAmount('')
    }
  }, [_handleRaise, customBetAmount, maxRaise, minRaise, raiseAmount])

  if (loadingGame) {
    return (
      <motion.div
        className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            className="text-white"
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
        className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-lg font-medium mb-2">
              {en.game.noGameLoaded}
            </div>
            <div className="text-sm">Join or create a game to see controls</div>
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

  const handleCustomBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBetAmount(e.target.value)
    setRaiseAmount(0)
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="space-y-4">
        {/* Action Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="destructive"
              size="lg"
              onClick={handleFold}
              disabled={!isMyTurn || takingAction}
              className="w-full h-12 text-lg font-bold"
            >
              Fold
            </Button>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {callAmount > 0 ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleCall}
                disabled={
                  !isMyTurn ||
                  takingAction ||
                  callAmount > (currentPlayer?.chips || 0)
                }
                className="w-full h-12 text-lg font-bold border-blue-500 text-blue-400 hover:bg-blue-500/20"
              >
                Call {formatMist(callAmount)}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={handleCheck}
                disabled={!isMyTurn || takingAction}
                className="w-full h-12 text-lg font-bold border-green-500 text-green-400 hover:bg-green-500/20"
              >
                Check
              </Button>
            )}
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleRaise}
              disabled={!isMyTurn || takingAction || maxRaise < minRaise}
              className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white"
            >
              {game.currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Raise Amount Controls */}
        <AnimatePresence>
          {isMyTurn && maxRaise >= minRaise && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  Min: {formatMist(minRaise)} <SuiIcon />
                </span>
                <span>
                  Max: {formatMist(maxRaise)} <SuiIcon />
                </span>
              </div>

              {/* Raise Slider */}
              <div className="space-y-2">
                <Slider
                  min={minRaise}
                  max={maxRaise}
                  value={[raiseAmount || minRaise]}
                  onValueChange={value => {
                    setRaiseAmount(value[0])
                    setCustomBetAmount('')
                  }}
                  className="w-full [&_[data-slot=slider-track]]:bg-gray-700 [&_[data-slot=slider-range]]:bg-orange-500 [&_[data-slot=slider-thumb]]:bg-orange-500 [&_[data-slot=slider-thumb]]:border-white"
                />
                {raiseAmount > 0 && (
                  <motion.div
                    className="text-center text-white font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatMist(raiseAmount)} <SuiIcon />
                  </motion.div>
                )}
              </div>

              {/* Custom Bet Input */}
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder={`Custom amount (${formatMist(
                    minRaise
                  )}-${formatMist(maxRaise)} SUI)`}
                  value={customBetAmount}
                  onChange={handleCustomBetChange}
                  min={minRaise}
                  max={maxRaise}
                  className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Quick Bet Buttons */}
              <div className="flex gap-2">
                {[
                  { label: 'Min', value: minRaise },
                  { label: '1/2 Pot', value: Math.floor(game.pot / 2) },
                  { label: 'Pot', value: game.pot },
                  { label: 'All-In', value: maxRaise },
                ].map((btn, index) => (
                  <motion.div
                    key={btn.label}
                    className="flex-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRaiseAmount(btn.value)
                        setCustomBetAmount('')
                      }}
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      {btn.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
