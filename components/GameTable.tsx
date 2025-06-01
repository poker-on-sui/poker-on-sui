'use client'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

import GameControls from './GameControls'
import OnTableStatus from './OnTableStatus'
import Players from './Players'
import tablePng from '~/assets/table.png'
import * as mocks from '~/lib/mock/game-state.mock'
import iconPng from '~/app/icon.png'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'
import { CommunityCards } from './CommunityCards'
import { useAccounts } from '@mysten/dapp-kit'
import WalletConnectionPrompt from './WalletConnectionPrompt'
// import { useGameTable } from '~/lib/hooks/useGameTable'

interface Props {
  readonly gameAddress?: string
}

export default function GameTable({}: Props) {
  const [account] = useAccounts()
  // const { game, isLoading } = useGameTable(gameAddress)
  const game = mocks.flopFourPlayersWithBetting
  const isLoading = false // Simulating loading state for the example

  return (
    <AnimatePresence mode="wait">
      {!account ? (
        <motion.div
          key="wallet-prompt"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full w-full"
        >
          <WalletConnectionPrompt />
        </motion.div>
      ) : (
        <motion.div
          key={`game-table-${account.address}`}
          className="h-full w-full relative grid grid-cols-1 grid-rows-1 *:col-start-1 *:row-start-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header with logo, heading and slogan */}
          <motion.div
            key={`header-${account.address}`}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center pt-6 pb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <motion.div
              key={`icon-${account.address}`}
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, rotateY: 15 }}
            >
              <Image
                src={iconPng}
                alt="Poker on SUI"
                className="drop-shadow-2xl size-[80px]"
                priority
              />
            </motion.div>
            <motion.h1
              key={`title-${account.address}`}
              className="text-xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {en.home.title}
            </motion.h1>
            <motion.div
              key={`slogan-${account.address}`}
              className="flex items-center justify-center opacity-80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="text-white italic text-sm">All-in-</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Image
                  src={suiIconSvg}
                  alt="SUI"
                  unoptimized
                  className="opacity-80 w-[8px] h-[10px]"
                />
              </motion.div>
            </motion.div>
          </motion.div>{' '}
          {/* The Table */}
          <motion.div
            key={`table-${account.address}`}
            className="w-full max-w-[920px] aspect-[1391px/658px] place-self-center relative -top-10 lg:-top-20"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              key={`table-image-${account.address}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Image
                src={tablePng}
                alt="Poker Table"
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>

            {/* Players positioned around the table */}
            <motion.div
              key={`players-${account.address}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Players
                players={game?.players || []}
                currentPlayerId={game?.players?.find(p => p.isActive)?.id}
              />
            </motion.div>

            <motion.div
              key={`community-cards-${account.address}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <CommunityCards cards={game.communityCards} />
            </motion.div>

            {/* Game content will go here */}
            <motion.div
              key={`table-status-${account.address}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <OnTableStatus
                game={game}
                loading={isLoading}
                address={account?.address}
              />
            </motion.div>
          </motion.div>
          <motion.div
            key={`game-controls-${account.address}`}
            className="absolute bottom-0 left-0 right-0 w-full z-10"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
          >
            <GameControls
              game={game}
              loading={isLoading}
              address={account?.address}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
