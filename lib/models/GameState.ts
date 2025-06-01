import { PokerGameState } from './MovePokerGameSchema'
import { Player } from './Player'

export interface GameState {
  id: string
  status: PokerGameState
  players: Player[]
  communityCards: string[]
  pot: number
  currentBet: number
  smallBlind: number
  bigBlind: number
  dealerPosition: number
  currentPlayer: number
  buyInAmount: number
}
