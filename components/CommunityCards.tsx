import Image from 'next/image'
import { cards as cardImages, CardName } from '~/assets/cards'
import { CARDS_SIZE, COMMUNITY_CARDS_POSITION_MAPS } from '~/lib/constants'

interface Props {
  cards?: string[]
}

export function CommunityCards({ cards }: Props) {
  const communityCards = cards || []

  return [0, 1, 2, 3, 4].map(index => {
    const card = communityCards[index] || 'hidden'
    const [x, y] = COMMUNITY_CARDS_POSITION_MAPS[index]
    const positionStyle = {
      left: `${x}%`,
      top: `${y}%`,
      width: `${CARDS_SIZE[0]}%`,
      height: `${CARDS_SIZE[1]}%`,
    }

    return (
      <div
        key={index}
        className='absolute transform -translate-x-1/2 -translate-y-1/2'
        style={positionStyle}
      >
        {card === 'hidden' ? (
          <Image
            src={cardImages.back}
            alt='Card Back'
            className='size-full object-cover'
          />
        ) : (
          <Image
            src={cardImages[card as CardName]}
            alt={card}
            className='size-full object-cover'
          />
        )}
      </div>
    )
  })
}
