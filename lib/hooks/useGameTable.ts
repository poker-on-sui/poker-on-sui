import { useState } from 'react'
import { useSuiClientInfiniteQuery, useSuiClientQuery } from '@mysten/dapp-kit'
import { GameState } from '../models/GameState'

export function useGameTable(addr?: string) {
  const [game] = useState<GameState | null>({
    id: addr || '',
    status: 'waiting',
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    smallBlind: 0,
    bigBlind: 0,
    dealerPosition: 0,
    activePlayerPosition: 0,
    round: 0,
  })

  useCurrentGame(addr)
  const history = useGameHistory(addr)

  // useEffect(() => {
  //   console.log('Game data:', data)
  //   if (isSuccess) {
  //     console.log('Game data fetched successfully:', data)
  //   } else if (isError) {
  //     console.error('Error fetching game data')
  //   } else if (isPending) {
  //     console.log('Fetching game data...')
  //   }
  // }, [data, isSuccess, isPending, isError])

  // Placeholder for game logic and state management
  // This hook can be expanded to include game state, player actions, etc.

  // For now, we just return an empty object
  return { game, history }
}

function useCurrentGame(addr: string | undefined) {
  return useSuiClientQuery('getObject', { id: addr! }, { enabled: !!addr })
  // Placeholder for current game logic
  // This can be expanded to include fetching the current game state, player actions, etc.
}

function useGameHistory(addr: string | undefined) {
  return useSuiClientInfiniteQuery(
    'queryEvents',
    { query: { Transaction: addr! } },
    { enabled: !!addr }
  )
}
