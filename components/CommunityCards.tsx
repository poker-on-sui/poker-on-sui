import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { cards as cardImages, CardName } from '~/assets/cards'
import { CARDS_SIZE, COMMUNITY_CARDS_POSITION_MAPS } from '~/lib/constants'

interface Props {
  cards?: string[]
}

export function CommunityCards({ cards }: Props) {
  const communityCards = cards || []

  return (
    <AnimatePresence>
      {[0, 1, 2, 3, 4].map(i => {
        const card = communityCards[i] || 'hidden'
        const [x, y] = COMMUNITY_CARDS_POSITION_MAPS[i]
        const positionStyle = {
          left: `${x}%`,
          top: `${y}%`,
          width: `${CARDS_SIZE[0]}%`,
          height: `${CARDS_SIZE[1]}%`,
        }

        return (
          // Container for each card
          <div
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={positionStyle}
          >
            <motion.div
              key={'card-' + i}
              initial={{ opacity: 0, rotateY: 180, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 * i, ease: 'backOut' }}
            >
              {card === 'hidden' ? (
                <Image
                  src={cardImages.back}
                  alt="Card Back"
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={cardImages[card as CardName]}
                  alt={card}
                  className="size-full object-cover"
                />
              )}
            </motion.div>
          </div>
        )
      })}
    </AnimatePresence>
  )
}
