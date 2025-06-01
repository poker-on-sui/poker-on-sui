'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { createAvatar } from '@dicebear/core'
import { notionists } from '@dicebear/collection'

import { Player } from '~/lib/models/Player'
import { cn } from '~/lib/utils'
import { en } from '~/lib/dictionaries'
import { CARDS_SIZE, PLAYERS_POSITION_MAPS } from '~/lib/constants'
import { cards as cardImages, CardName } from '~/assets/cards'

interface Props {
  readonly players: Player[]
  readonly currentPlayerId?: string
}

// Player avatar component with popover
interface PlayerAvatarProps {
  readonly player: Player
  readonly position: { x: number; y: number; rotation: number }
  readonly isCurrentPlayer: boolean
}

const PlayerBlock: React.FC<PlayerAvatarProps> = ({
  player,
  position,
  isCurrentPlayer,
}) => {
  const [showPopover, setShowPopover] = useState(false)

  // Generate a mock address for demo purposes
  const playerAddress = `0x${player.id.padEnd(64, '0')}`
  const avatar = createAvatar(notionists, { seed: player.id })

  return (
    // Container for the player block
    <div
      className='absolute transform -translate-x-1/2 -translate-y-1/2 z-20'
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${CARDS_SIZE[0]}%`,
        height: `${CARDS_SIZE[1]}%`,
        rotate: `${position.rotation}deg`,
      }}
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
      onClick={() => setShowPopover(!showPopover)}
    >
      {/* Player cards */}

      <div className='w-full h-full relative'>
        {[0, 1].map(index => {
          const card = player.cards[index] || 'hidden'
          const cardPosition = index === 0 ? 'left-0' : 'left-[110%]'
          return card === 'hidden' ? (
            <Image
              src={cardImages.back}
              alt='Card Back'
              className={cn('absolute left-0 top-0 object-cover', cardPosition)}
            />
          ) : (
            <Image
              src={cardImages[card as CardName]}
              alt={card}
              className={cn('absolute left-0 top-0 object-cover', cardPosition)}
            />
          )
        })}
      </div>

      {/* Player info container */}
      <div
        className='absolute top-[calc(150%)] left-0'
        style={{ rotate: `${-position.rotation}deg` }}
      >
        {/* Player avatar */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg cursor-pointer transition-all duration-200',
            isCurrentPlayer && 'ring-4 ring-yellow-400 ring-opacity-75',
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
          <Image
            src={avatar.toDataUri()}
            alt={player.name}
            width={48}
            height={48}
            className='w-12 h-12 rounded-full object-cover'
          />
        </div>

        {/* Indicator badges */}
        <div className='absolute -top-1 -right-1 flex flex-col gap-0.5'>
          {player.isDealer && (
            <div className='w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold'>
              D
            </div>
          )}
          {player.isSmallBlind && (
            <div className='w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold'>
              S
            </div>
          )}
          {player.isBigBlind && (
            <div className='w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold'>
              B
            </div>
          )}
        </div>

        {/* Player name */}
        <div className='absolute top-14 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded whitespace-nowrap'>
          {player.name}
        </div>

        {/* Chips count */}
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 font-bold whitespace-nowrap'>
          ${player.chips}
        </div>

        {/* Current bet */}
        {player.currentBet > 0 && (
          <div className='absolute -left-8 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold'>
            ${player.currentBet}
          </div>
        )}

        {/* Popover */}
        {showPopover && (
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30'>
            <div className='bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 min-w-[200px]'>
              <div className='text-sm font-bold mb-2'>{player.name}</div>
              <div className='text-xs space-y-1'>
                <div>
                  {en.game.address} {playerAddress.slice(0, 8)}...
                  {playerAddress.slice(-6)}
                </div>
                <div>
                  {en.game.chips} ${player.chips}
                </div>
                <div>
                  {en.game.position} {player.position}
                </div>
                {player.currentBet > 0 && (
                  <div>
                    {en.game.currentBetLabel} ${player.currentBet}
                  </div>
                )}
                <div className='flex gap-2 mt-2'>
                  {player.isDealer && (
                    <span className='bg-red-500 px-1 py-0.5 rounded text-xs'>
                      {en.game.dealer}
                    </span>
                  )}
                  {player.isSmallBlind && (
                    <span className='bg-blue-500 px-1 py-0.5 rounded text-xs'>
                      {en.game.smallBlind}
                    </span>
                  )}
                  {player.isBigBlind && (
                    <span className='bg-green-500 px-1 py-0.5 rounded text-xs'>
                      {en.game.bigBlind}
                    </span>
                  )}
                  {player.isFolded && (
                    <span className='bg-gray-500 px-1 py-0.5 rounded text-xs'>
                      {en.game.folded}
                    </span>
                  )}
                </div>
              </div>
              {/* Arrow pointing down */}
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
            </div>
          </div>
        )}
      </div>
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
          />
        )
      })}
    </>
  )
}
