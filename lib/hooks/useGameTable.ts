import { useEffect, useState } from 'react'
import { useSuiClientInfiniteQuery, useSuiClientQuery } from '@mysten/dapp-kit'
import { GameState } from '../models/GameState'
import { MovePokerGameSchema } from '../models/MovePokerGameSchema'

export function useGameTable(addr?: string) {
  const { game, isLoading } = useCurrentGame(addr)
  const history = useGameHistory(addr)

  return { game, history, isLoading }
}

function useCurrentGame(addr: string | undefined) {
  const [game, setGame] = useState<GameState | undefined>()
  const { data, isSuccess, isError, isLoading, error } = useSuiClientQuery(
    'getObject',
    { id: addr!, options: { showContent: true } },
    {
      enabled: !!addr,
      select(data) {
        const content = data.data?.content
        if (!content || content.dataType !== 'moveObject') return
        return MovePokerGameSchema.parse(content.fields)
      },
    }
  )

  useEffect(() => {
    if (isSuccess && data) {
      setGame(prev => ({
        ...prev,
        id: data.id.id,
        status: data.state,
        players: prev?.players ?? [],
        // players: chainData.players.map(player => player.id),
        communityCards: data.community_cards,
        pot: data.pot,
        currentBet: data.current_bet,
        smallBlind: data.small_blind,
        bigBlind: data.big_blind,
        dealerPosition: data.dealer_position,
        currentPlayer: data.current_player,
      }))
    }
  }, [isSuccess, data, addr, setGame])

  useEffect(() => {
    if (isError) console.error('Error fetching game:', error)
  }, [isError, error])

  return { game, isLoading }
}

function useGameHistory(addr: string | undefined) {
  return useSuiClientInfiniteQuery(
    'queryEvents',
    { query: { Transaction: addr! } },
    { enabled: !!addr }
  )
}
