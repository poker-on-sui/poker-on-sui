'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { createAvatar } from '@dicebear/core'
import { notionists } from '@dicebear/collection'

import { Player } from '~/lib/models/Player'
import { cn } from '~/lib/utils'
import { en } from '~/lib/dictionaries'
import { CARDS_SIZE, PLAYERS_POSITION_MAPS } from '~/lib/constants'
import { cards as cardImages, CardName } from '~/assets/cards'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

interface Props {
  readonly players: Player[]
  readonly currentPlayerId?: string
}

// Player avatar component with popover
interface PlayerAvatarProps {
  readonly player: Player
  readonly position: { x: number; y: number; rotation: number }
  readonly isCurrentPlayer: boolean
  readonly index: number
}

const PlayerBlock: React.FC<PlayerAvatarProps> = ({
  player,
  position,
  isCurrentPlayer,
  index,
}) => {
  // Generate a mock address for demo purposes
  const playerAddress = `0x${player.id.padEnd(64, '0')}`
  const avatar = createAvatar(notionists, { seed: player.id })

  return (
    // Container for the player block with animation
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${CARDS_SIZE[0]}%`,
        height: `${CARDS_SIZE[1]}%`,
        rotate: `${position.rotation}deg`,
      }}
    >
      {/* Player cards */}
      <div className="w-full h-full relative">
        {[0, 1].map(cardIndex => {
          const card = player.cards[cardIndex] || 'hidden'
          const cardPosition = cardIndex === 0 ? 'left-0' : 'left-[110%]'
          return (
            <motion.div
              key={cardIndex}
              className={cn('absolute w-full h-full top-0', cardPosition)}
              initial={{ opacity: 0, rotateY: 180, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + 0.1 * index + 0.2 * cardIndex,
                ease: 'easeOut',
              }}
            >
              {card === 'hidden' ? (
                <Image
                  src={cardImages.back}
                  alt="Card Back"
                  className="object-cover"
                />
              ) : (
                <Image
                  src={cardImages[card as CardName]}
                  alt={card}
                  className="object-cover"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Player info container */}
      <motion.div
        className="absolute top-[calc(150%)] left-0"
        style={{ rotate: `${-position.rotation}deg` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.6 + 0.1 * index,
          ease: 'easeOut',
        }}
      >
        <Popover>
          <PopoverTrigger asChild>
            {/* Player avatar */}
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg cursor-pointer transition-all duration-200, relative',
                player.isDealer && 'bg-red-600',
                player.isSmallBlind && 'bg-blue-600',
                player.isBigBlind && 'bg-green-600',
                !player.isDealer &&
                  !player.isSmallBlind &&
                  !player.isBigBlind &&
                  'bg-gray-600',
                player.isFolded && 'opacity-50',
                !player.isActive && 'opacity-30'
              )}
            >
              {/* Ping current user */}
              {isCurrentPlayer && (
                <div className="absolute -z-1 top-0 left-0 size-full rounded-full bg-yellow-400 animate-ping" />
              )}
              {/* Player avatar image */}
              <Image
                src={avatar.toDataUri()}
                alt={player.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-[200px] bg-gray-900 text-white border-gray-700"
            side="top"
            align="center"
          >
            <div className="text-sm font-bold mb-2">{player.name}</div>
            <div className="text-xs space-y-1">
              <div>
                {en.game.address} {playerAddress.slice(0, 8)}...
                {playerAddress.slice(-6)}
              </div>

              {/* Player hand */}
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Hand:</div>
                <div className="flex gap-2">
                  {[0, 1].map(index => {
                    const card = player.cards[index] || 'hidden'
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-6 h-8 relative">
                          {card === 'hidden' ? (
                            <Image
                              src={cardImages.back}
                              alt="Hidden Card"
                              width={24}
                              height={32}
                              className="w-full h-full object-cover rounded-sm"
                            />
                          ) : (
                            <Image
                              src={cardImages[card as CardName]}
                              alt={card}
                              width={24}
                              height={32}
                              className="w-full h-full object-cover rounded-sm"
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-300 text-center">
                          {card === 'hidden' ? '?' : card.replace('_', ' ')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Player roles and status */}
              <div className="flex gap-2 mt-2">
                {player.isDealer && (
                  <span className="bg-red-500 px-1 py-0.5 rounded text-xs">
                    {en.game.dealer}
                  </span>
                )}
                {player.isSmallBlind && (
                  <span className="bg-blue-500 px-1 py-0.5 rounded text-xs">
                    {en.game.smallBlind}
                  </span>
                )}
                {player.isBigBlind && (
                  <span className="bg-green-500 px-1 py-0.5 rounded text-xs">
                    {en.game.bigBlind}
                  </span>
                )}
                {player.isFolded && (
                  <span className="bg-gray-500 px-1 py-0.5 rounded text-xs">
                    {en.game.folded}
                  </span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Indicator badges */}
        <div className="absolute -top-1 -right-1 flex flex-col gap-0.5">
          {player.isDealer && (
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              D
            </div>
          )}
          {player.isSmallBlind && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              S
            </div>
          )}
          {player.isBigBlind && (
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              B
            </div>
          )}
        </div>

        {/* Player name */}
        <motion.div
          className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.9 + 0.1 * index,
            ease: 'easeOut',
          }}
        >
          {player.name}
        </motion.div>

        {/* Chips count */}
        <motion.div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 font-bold whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.0 + 0.1 * index,
            ease: 'easeOut',
          }}
        >
          ${player.chips}
        </motion.div>

        {/* Current bet */}
        {player.currentBet > 0 && (
          <motion.div
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 1.1 + 0.1 * index,
              ease: 'backOut',
            }}
            whileHover={{ scale: 1.1 }}
          >
            ${player.currentBet}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Main Players component
export default function Players({ players, currentPlayerId }: Props) {
  return (
    <>
      {players.map((player, i) => {
        const [x, y, rotation] = PLAYERS_POSITION_MAPS[i]
        return (
          <PlayerBlock
            key={player.id}
            player={player}
            position={{ x, y, rotation }}
            isCurrentPlayer={player.id === currentPlayerId}
            index={i}
          />
        )
      })}
    </>
  )
}
