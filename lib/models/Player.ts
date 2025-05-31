// Types for the game state
export interface Player {
  id: string
  name: string
  chips: number
  cards: string[]
  isFolded: boolean
  isActive: boolean
  hasActed: boolean
  currentBet: number
  isDealer: boolean
  isSmallBlind: boolean
  isBigBlind: boolean
  position: number
}
