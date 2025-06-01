import { useSuiClientQuery } from '@mysten/dapp-kit'
import { SuiClient } from '@mysten/sui/client'
import Haikunator from 'haikunator'

import { MovePokerGameSchema } from '../models/MovePokerGameSchema'
import { GameState } from '../models/GameState'
import { Player } from '../models/Player'
import { cardNameFromSuitAndValue } from '~/assets/cards'

export async function getGameInfo(gameAddress: string, client: SuiClient) {
  const { data, error } = await client.getObject({
    id: gameAddress,
    options: { showContent: true, showType: true },
  })
  if (error) throw error
  const content = data?.content
  if (!content || content.dataType !== 'moveObject') return
  return parseState(MovePokerGameSchema.parse(content.fields))
}

export const useGameInfoQuery = (gameAddress?: string) =>
  useSuiClientQuery(
    'getObject',
    { id: gameAddress!, options: { showContent: true, showType: true } },
    {
      enabled: !!gameAddress,
      refetchInterval: 1000, // Adjust as needed for real-time updates
      select({ data }) {
        const content = data?.content
        if (!content || content.dataType !== 'moveObject') return
        const pased = MovePokerGameSchema.safeParse(content.fields)
        if (!pased.success) {
          console.error('Failed to parse game state:', pased.error)
          return undefined
        }
        try {
          return parseState(pased.data)
        } catch (error) {
          console.error('Error parsing game state:', error)
          return undefined
        }
      },
    }
  )

function parseState(data: MovePokerGameSchema): GameState {
  return {
    id: data.id.id,
    status: data.state,
    // players: prev?.players ?? [],
    players: data.players
      .map(p => p.fields)
      .map<Player>(p => {
        const playerAddr = p.addr
        const playerPos = data.players.findIndex(
          player => player.fields.addr === playerAddr
        )
        const smallBlindPosition =
          (data.dealer_position + 1) % data.players.length
        const bigBlindPosition =
          (data.dealer_position + 2) % data.players.length

        return {
          id: p.addr,
          name: new Haikunator({ seed: p.addr }).haikunate(),
          chips: p.balance,
          cards: p.cards.map(card => {
            const { suit, value } = card.fields
            return cardNameFromSuitAndValue(suit, value)
          }),
          isFolded: p.is_folded,
          isActive: p.is_folded || p.is_all_in, // TODO: Determine active status based on game state
          currentBet: p.current_bet,
          isDealer: data.dealer_position === playerPos,
          isSmallBlind: smallBlindPosition === playerPos,
          isBigBlind: bigBlindPosition === playerPos,
          position: playerPos,
        }
      }),
    communityCards: data.community_cards,
    pot: data.pot,
    currentBet: data.current_bet,
    smallBlind: data.small_blind,
    bigBlind: data.big_blind,
    dealerPosition: data.dealer_position,
    currentPlayer: data.current_player,
    buyInAmount: data.buy_in,
  }
}
