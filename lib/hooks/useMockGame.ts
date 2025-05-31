import { useState, useEffect } from 'react'

// Types for the game state
export interface Player {
  id: string
  name: string
  chips: number
  cards?: string[]
  isFolded?: boolean
  isActive?: boolean
  hasActed?: boolean
  currentBet?: number
  isDealer?: boolean
  isSmallBlind?: boolean
  isBigBlind?: boolean
  position: number
}

export interface GameState {
  id: string
  status:
    | 'waiting'
    | 'preflop'
    | 'flop'
    | 'turn'
    | 'river'
    | 'showdown'
    | 'finished'
  players: (Player | null)[]
  communityCards: string[]
  pot: number
  currentBet: number
  smallBlind: number
  bigBlind: number
  dealerPosition: number
  activePlayerPosition: number
  round: number
  maxPlayers: number
}

const mockGame: GameState = {
  id: '0x00',
  status: 'flop',
  players: [
    {
      id: '1',
      name: 'Alice',
      chips: 4750,
      cards: ['A♠', 'K♥'],
      isActive: true,
      hasActed: false,
      currentBet: 100,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      position: 0,
    },
    {
      id: '2',
      name: 'Bob',
      chips: 3200,
      cards: ['?', '?'],
      isActive: false,
      hasActed: true,
      currentBet: 100,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      position: 1,
    },
    null, // Empty slot
    {
      id: '4',
      name: 'Charlie',
      chips: 2800,
      cards: ['?', '?'],
      isActive: false,
      hasActed: true,
      currentBet: 0,
      isFolded: true,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      position: 3,
    },
    null, // Empty slot
    {
      id: '6',
      name: 'Diana',
      chips: 4150,
      cards: ['?', '?'],
      isActive: false,
      hasActed: true,
      currentBet: 100,
      isDealer: true,
      isSmallBlind: false,
      isBigBlind: false,
      position: 5,
    },
    {
      id: '7',
      name: 'Eve',
      chips: 1450,
      cards: ['?', '?'],
      isActive: false,
      hasActed: true,
      currentBet: 100,
      isDealer: false,
      isSmallBlind: true,
      isBigBlind: false,
      position: 6,
    },
    {
      id: '8',
      name: 'Frank',
      chips: 3400,
      cards: ['?', '?'],
      isActive: false,
      hasActed: true,
      currentBet: 100,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: true,
      position: 7,
    },
  ],
  communityCards: ['A♠', 'K♥', '7♦'],
  pot: 750,
  currentBet: 100,
  smallBlind: 25,
  bigBlind: 50,
  dealerPosition: 5,
  activePlayerPosition: 0,
  round: 3,
  maxPlayers: 8,
}

export function useMockGame(addr?: string) {
  const [game, setGame] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // Mock game state for UI testing

        setGame(mockGame)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load game state'
        )
        setGame(null)
      } finally {
        setLoading(false)
      }
    }, 1000) // Simulate 1 second loading time

    return () => clearTimeout(timer)
  }, [addr])

  // Mock actions for testing
  const fold = () => {
    if (!game) return

    setGame(prev => {
      if (!prev) return prev

      const newPlayers = [...prev.players]
      const activePlayer = newPlayers[prev.activePlayerPosition]
      if (activePlayer) {
        activePlayer.isFolded = true
        activePlayer.isActive = false
        activePlayer.hasActed = true
      }

      // Move to next active player
      const nextActivePosition = getNextActivePlayer(
        newPlayers,
        prev.activePlayerPosition
      )
      if (nextActivePosition !== -1) {
        const nextPlayer = newPlayers[nextActivePosition]
        if (nextPlayer) {
          nextPlayer.isActive = true
        }
      }

      return {
        ...prev,
        players: newPlayers,
        activePlayerPosition: nextActivePosition,
      }
    })
  }

  const call = () => {
    if (!game) return

    setGame(prev => {
      if (!prev) return prev

      const newPlayers = [...prev.players]
      const activePlayer = newPlayers[prev.activePlayerPosition]
      if (activePlayer) {
        const callAmount = prev.currentBet - (activePlayer.currentBet || 0)
        activePlayer.chips -= callAmount
        activePlayer.currentBet = prev.currentBet
        activePlayer.isActive = false
        activePlayer.hasActed = true
      }

      // Move to next active player
      const nextActivePosition = getNextActivePlayer(
        newPlayers,
        prev.activePlayerPosition
      )
      if (nextActivePosition !== -1) {
        const nextPlayer = newPlayers[nextActivePosition]
        if (nextPlayer) {
          nextPlayer.isActive = true
        }
      }

      return {
        ...prev,
        players: newPlayers,
        pot: prev.pot + (activePlayer?.currentBet || 0),
        activePlayerPosition: nextActivePosition,
      }
    })
  }

  const raise = (amount: number) => {
    if (!game) return

    setGame(prev => {
      if (!prev) return prev

      const newPlayers = [...prev.players]
      const activePlayer = newPlayers[prev.activePlayerPosition]
      if (activePlayer) {
        activePlayer.chips -= amount
        activePlayer.currentBet = (activePlayer.currentBet || 0) + amount
        activePlayer.isActive = false
        activePlayer.hasActed = true
      }

      // Move to next active player
      const nextActivePosition = getNextActivePlayer(
        newPlayers,
        prev.activePlayerPosition
      )
      if (nextActivePosition !== -1) {
        const nextPlayer = newPlayers[nextActivePosition]
        if (nextPlayer) {
          nextPlayer.isActive = true
        }
      }

      return {
        ...prev,
        players: newPlayers,
        currentBet: Math.max(prev.currentBet, activePlayer?.currentBet || 0),
        pot: prev.pot + amount,
        activePlayerPosition: nextActivePosition,
      }
    })
  }

  return {
    game,
    loading,
    error,
    actions: {
      fold,
      call,
      raise,
    },
  }
}

// Helper function to find the next active player
function getNextActivePlayer(
  players: (Player | null)[],
  currentPosition: number
): number {
  for (let i = 1; i < players.length; i++) {
    const nextPos = (currentPosition + i) % players.length
    const player = players[nextPos]
    if (player && !player.isFolded && !player.hasActed) {
      return nextPos
    }
  }
  return -1
}
