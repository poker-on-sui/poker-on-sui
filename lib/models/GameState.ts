import { Player } from './Player'

export interface GameState {
  id: string
  status:
    | 'loading'
    | 'waiting'
    | 'preflop'
    | 'flop'
    | 'turn'
    | 'river'
    | 'showdown'
    | 'finished'
  players: Player[]
  communityCards: string[]
  pot: number
  currentBet: number
  smallBlind: number
  bigBlind: number
  dealerPosition: number
  activePlayerPosition: number
  round: number
}
