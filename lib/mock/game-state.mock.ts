// filepath: /Users/toan/code/CommandOSS/poker_on_sui/lib/mock/game-state.mock.ts
import { GameState } from '../models/GameState'
import { Player } from '../models/Player'
import { PokerGameState } from '../models/MovePokerGameSchema'

// Mock player data
const createMockPlayer = (
  id: string,
  name: string,
  position: number,
  chips: number = 1000,
  cards: string[] = [],
  overrides: Partial<Player> = {}
): Player => ({
  id,
  name,
  chips,
  cards,
  isFolded: false,
  isActive: true,
  currentBet: 0,
  isDealer: false,
  isSmallBlind: false,
  isBigBlind: false,
  position,
  ...overrides,
})

// Common player sets
const twoPlayers = [
  createMockPlayer('player_1', 'Alice', 0, 1000, ['A_spade', 'K_spade'], {
    isDealer: true,
    isBigBlind: true,
  }),
  createMockPlayer('player_2', 'Bob', 1, 950, ['Q_heart', 'Q_diamond'], {
    isSmallBlind: true,
  }),
]

const fourPlayers = [
  createMockPlayer('player_1', 'Alice', 0, 1000, ['A_spade', 'K_spade'], {
    isDealer: true,
  }),
  createMockPlayer('player_2', 'Bob', 1, 950, ['Q_heart', 'Q_diamond'], {
    isSmallBlind: true,
  }),
  createMockPlayer('player_3', 'Charlie', 2, 1200, ['J_club', '10_club'], {
    isBigBlind: true,
  }),
  createMockPlayer('player_4', 'Diana', 3, 800, ['A_heart', 'A_club']),
]

const sixPlayers = [
  ...fourPlayers,
  createMockPlayer('player_5', 'Eve', 4, 1500, ['K_heart', 'K_club']),
  createMockPlayer('player_6', 'Frank', 5, 750, ['9_spade', '9_heart']),
]

const eightPlayers = [
  ...sixPlayers,
  createMockPlayer('player_7', 'Grace', 6, 1100, ['A_diamond', 'J_spade']),
  createMockPlayer('player_8', 'Henry', 7, 900, ['10_heart', '10_spade']),
]

// Game state mocks for different scenarios

// 1. WAITING_FOR_PLAYERS states
export const waitingForPlayersEmpty: GameState = {
  id: 'game_waiting_empty',
  status: PokerGameState.WAITING_FOR_PLAYERS,
  players: [],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const waitingForPlayersOnePlayer: GameState = {
  id: 'game_waiting_one',
  status: PokerGameState.WAITING_FOR_PLAYERS,
  players: [twoPlayers[0]],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const waitingForPlayersTwoPlayers: GameState = {
  id: 'game_waiting_two',
  status: PokerGameState.WAITING_FOR_PLAYERS,
  players: twoPlayers,
  communityCards: [],
  pot: 0,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

// 2. PRE_FLOP states
export const preFlopTwoPlayers: GameState = {
  id: 'game_preflop_two',
  status: PokerGameState.PRE_FLOP,
  players: twoPlayers.map((p, i) => ({
    ...p,
    currentBet: i === 0 ? 50 : 25, // Big blind and small blind
  })),
  communityCards: [],
  pot: 75,
  currentBet: 50,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const preFlopFourPlayers: GameState = {
  id: 'game_preflop_four',
  status: PokerGameState.PRE_FLOP,
  players: fourPlayers.map((p, i) => ({
    ...p,
    currentBet: i === 1 ? 25 : i === 2 ? 50 : 0,
  })),
  communityCards: [],
  pot: 75,
  currentBet: 50,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 3,
}

export const preFlopWithRaises: GameState = {
  id: 'game_preflop_raises',
  status: PokerGameState.PRE_FLOP,
  players: fourPlayers.map((p, i) => ({
    ...p,
    currentBet: i === 0 ? 200 : i === 1 ? 25 : i === 2 ? 50 : 200,
    chips: p.chips - (i === 0 ? 200 : i === 1 ? 25 : i === 2 ? 50 : 200),
  })),
  communityCards: [],
  pot: 475,
  currentBet: 200,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 1,
}

export const preFlopWithFolds: GameState = {
  id: 'game_preflop_folds',
  status: PokerGameState.PRE_FLOP,
  players: fourPlayers.map((p, i) => ({
    ...p,
    isFolded: i === 1 || i === 3,
    currentBet: i === 2 ? 50 : i === 0 ? 100 : 0,
  })),
  communityCards: [],
  pot: 175,
  currentBet: 100,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 2,
}

// 3. FLOP states
export const flopTwoPlayers: GameState = {
  id: 'game_flop_two',
  status: PokerGameState.FLOP,
  players: twoPlayers.map(p => ({
    ...p,
    currentBet: 0,
  })),
  communityCards: ['A_heart', 'K_club', 'Q_spade'],
  pot: 150,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 1,
}

export const flopFourPlayersWithBetting: GameState = {
  id: 'game_flop_betting',
  status: PokerGameState.FLOP,
  players: fourPlayers.map((p, i) => ({
    ...p,
    currentBet: i === 0 ? 100 : i === 1 ? 100 : 0,
  })),
  communityCards: ['A_heart', 'K_club', 'Q_spade'],
  pot: 350,
  currentBet: 100,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 2,
}

export const flopSixPlayersWithFolds: GameState = {
  id: 'game_flop_folds',
  status: PokerGameState.FLOP,
  players: sixPlayers.map((p, i) => ({
    ...p,
    isFolded: i === 1 || i === 3 || i === 5,
    currentBet: i === 0 ? 150 : i === 2 ? 150 : i === 4 ? 150 : 0,
  })),
  communityCards: ['J_heart', '10_club', '9_spade'],
  pot: 675,
  currentBet: 150,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

// 4. TURN states
export const turnTwoPlayersAllIn: GameState = {
  id: 'game_turn_allin',
  status: PokerGameState.TURN,
  players: twoPlayers.map(p => ({
    ...p,
    currentBet: p.chips,
    chips: 0,
  })),
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond'],
  pot: 1950,
  currentBet: 1000,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const turnFourPlayersActive: GameState = {
  id: 'game_turn_active',
  status: PokerGameState.TURN,
  players: fourPlayers.map((p, i) => ({
    ...p,
    currentBet: i < 3 ? 200 : 0,
  })),
  communityCards: ['2_heart', '2_club', '7_spade', 'A_diamond'],
  pot: 875,
  currentBet: 200,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 3,
}

// 5. RIVER states
export const riverTwoPlayersShowdown: GameState = {
  id: 'game_river_showdown',
  status: PokerGameState.RIVER,
  players: twoPlayers.map(p => ({
    ...p,
    currentBet: 300,
  })),
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond', '10_heart'],
  pot: 1200,
  currentBet: 300,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const riverThreePlayersLastBet: GameState = {
  id: 'game_river_lastbet',
  status: PokerGameState.RIVER,
  players: fourPlayers.slice(0, 3).map((p, i) => ({
    ...p,
    isFolded: false,
    currentBet: i < 2 ? 500 : 0,
  })),
  communityCards: ['K_heart', 'K_club', '7_spade', '7_diamond', '2_heart'],
  pot: 1775,
  currentBet: 500,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 2,
}

// 6. SHOWDOWN states
export const showdownTwoPlayers: GameState = {
  id: 'game_showdown_two',
  status: PokerGameState.SHOWDOWN,
  players: twoPlayers.map(p => ({
    ...p,
    cards: p.cards, // Cards are revealed
  })),
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond', '10_heart'],
  pot: 1200,
  currentBet: 300,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const showdownMultiplePlayersWithSidePots: GameState = {
  id: 'game_showdown_sidepots',
  status: PokerGameState.SHOWDOWN,
  players: [
    createMockPlayer('player_1', 'Alice', 0, 0, ['A_spade', 'A_heart'], {
      currentBet: 500,
    }),
    createMockPlayer('player_2', 'Bob', 1, 0, ['K_spade', 'K_heart'], {
      currentBet: 800,
    }),
    createMockPlayer('player_3', 'Charlie', 2, 0, ['Q_spade', 'Q_heart'], {
      currentBet: 1200,
    }),
  ],
  communityCards: ['A_club', 'K_club', 'Q_club', 'J_club', '10_club'],
  pot: 2500,
  currentBet: 1200,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

// 7. GAME_OVER states
export const gameOverWinner: GameState = {
  id: 'game_over_winner',
  status: PokerGameState.GAME_OVER,
  players: [
    createMockPlayer('player_1', 'Alice', 0, 2500, [], {
      isActive: true,
    }),
    createMockPlayer('player_2', 'Bob', 1, 0, [], {
      isActive: false,
    }),
  ],
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond', '10_heart'],
  pot: 0,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

export const gameOverMultipleWinners: GameState = {
  id: 'game_over_multiple',
  status: PokerGameState.GAME_OVER,
  players: [
    createMockPlayer('player_1', 'Alice', 0, 1250, [], {
      isActive: true,
    }),
    createMockPlayer('player_2', 'Bob', 1, 1250, [], {
      isActive: true,
    }),
    createMockPlayer('player_3', 'Charlie', 2, 0, [], {
      isActive: false,
    }),
  ],
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond', '10_heart'],
  pot: 0,
  currentBet: 0,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

// Special scenarios
export const eightPlayersFullTable: GameState = {
  id: 'game_eight_players',
  status: PokerGameState.PRE_FLOP,
  players: eightPlayers.map((p, i) => ({
    ...p,
    currentBet: i === 1 ? 25 : i === 2 ? 50 : 0,
  })),
  communityCards: [],
  pot: 75,
  currentBet: 50,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 3,
}

export const lowStacksEndGame: GameState = {
  id: 'game_low_stacks',
  status: PokerGameState.RIVER,
  players: [
    createMockPlayer('player_1', 'Alice', 0, 75, ['A_spade', 'K_spade'], {
      currentBet: 75,
    }),
    createMockPlayer('player_2', 'Bob', 1, 50, ['Q_heart', 'J_heart'], {
      currentBet: 50,
    }),
    createMockPlayer('player_3', 'Charlie', 2, 25, ['10_club', '9_club'], {
      currentBet: 25,
    }),
  ],
  communityCards: ['A_heart', 'K_club', 'Q_spade', 'J_diamond', '10_heart'],
  pot: 150,
  currentBet: 75,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 0,
  currentPlayer: 0,
}

// Export all mock states for easy access
export const mockGameStates = {
  // Waiting states
  waitingForPlayersEmpty,
  waitingForPlayersOnePlayer,
  waitingForPlayersTwoPlayers,

  // Pre-flop states
  preFlopTwoPlayers,
  preFlopFourPlayers,
  preFlopWithRaises,
  preFlopWithFolds,

  // Flop states
  flopTwoPlayers,
  flopFourPlayersWithBetting,
  flopSixPlayersWithFolds,

  // Turn states
  turnTwoPlayersAllIn,
  turnFourPlayersActive,

  // River states
  riverTwoPlayersShowdown,
  riverThreePlayersLastBet,

  // Showdown states
  showdownTwoPlayers,
  showdownMultiplePlayersWithSidePots,

  // Game over states
  gameOverWinner,
  gameOverMultipleWinners,

  // Special scenarios
  tenPlayersFullTable: eightPlayersFullTable,
  lowStacksEndGame,
}

// Helper function to get random mock state
export const getRandomMockState = (): GameState => {
  const states = Object.values(mockGameStates)
  return states[Math.floor(Math.random() * states.length)]
}

// Helper function to get mock state by game phase
export const getMockStateByPhase = (phase: PokerGameState): GameState[] => {
  return Object.values(mockGameStates).filter(state => state.status === phase)
}

// Helper function to get mock state by player count
export const getMockStateByPlayerCount = (playerCount: number): GameState[] => {
  return Object.values(mockGameStates).filter(
    state => state.players.length === playerCount
  )
}
