'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '~/components/ui/button'
import { useGameActions } from '~/lib/hooks/useGameActions'
import { en } from '~/lib/dictionaries'
import { GameState } from '~/lib/models/GameState'
import { PokerGameState } from '~/lib/models/MovePokerGameSchema'
import { cn } from '~/lib/utils'
import { formatMist } from '~/lib/format-mist'
import { SuiIcon } from './SuiIcon'

interface Props {
  readonly game?: GameState
  loading?: boolean
  /** Current connected wallet address */
  address?: string
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
  const actions = useGameActions()

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-white"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {en.game.loadingGame}
        </motion.div>
      </motion.div>
    )
  }

  if (!game) {
    return (
      <motion.div
        className="flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-white text-lg mb-2">{en.game.noGameLoaded}</div>
          <div className="text-gray-400 text-sm">
            {en.game.joinOrCreateGame}
          </div>
        </div>
      </motion.div>
    )
  }

  const currentPlayer = game.players[game.currentPlayer]
  const isMyTurn = currentPlayer?.isActive && !currentPlayer?.isFolded
  const isWaitingForPlayers =
    game.status === PokerGameState.WAITING_FOR_PLAYERS &&
    game.players.length < 2
  const canStart =
    game.status === PokerGameState.WAITING_FOR_PLAYERS &&
    game.players.length >= 2

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Game Info */}
      <AnimatePresence>
        {isWaitingForPlayers && (
          <motion.div
            className="grid grid-cols-2 text-white text-sm text-nowrap"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gray-400">{en.game.pot}</span>{' '}
            <span className="font-bold text-green-400 text-right">
              {formatMist(game.pot)} <SuiIcon />
            </span>
            <span className="text-gray-400">{en.game.currentBet}</span>{' '}
            <span className="font-bold text-yellow-400 text-right">
              {formatMist(game.currentBet)} <SuiIcon />
            </span>
            <span className="text-gray-400">{en.game.yourChips}</span>{' '}
            <span className="font-bold text-blue-400 text-right">
              {formatMist(currentPlayer?.chips)} <SuiIcon />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Able to start Game UI */}
      <AnimatePresence>
        {canStart && (
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => actions.createGame()}
                disabled={actions.isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-700 text-white text-lg font-bold px-8 py-3 rounded-lg shadow-lg hover:from-green-400 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
              >
                {actions.isLoading
                  ? en.game.status.starting
                  : en.game.startGame}
              </Button>
            </motion.div>
            <motion.div
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {game.players.length} {en.game.playersJoined}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Status */}
      <AnimatePresence>
        {game.status !== PokerGameState.WAITING_FOR_PLAYERS && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {!isMyTurn ? (
              <motion.div
                className="text-gray-400 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {en.game.waitingFor}{' '}
                {currentPlayer?.name || en.game.otherPlayer}
                ...
              </motion.div>
            ) : (
              <motion.div
                className="text-green-400 text-sm font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {en.game.yourTurn} {currentPlayer?.name}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Phase Indicator */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {(() => {
          const phaseStyles = getPhaseStyles(game.status)
          return (
            <motion.div
              className={`inline-flex items-center px-3 py-1 rounded-full ${phaseStyles.bg} border ${phaseStyles.border}`}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255, 255, 255, 0.4)',
                  '0 0 0 10px rgba(255, 255, 255, 0)',
                  '0 0 0 0 rgba(255, 255, 255, 0)',
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
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
            </motion.div>
          )
        })()}
      </motion.div>
    </motion.div>
  )
}
