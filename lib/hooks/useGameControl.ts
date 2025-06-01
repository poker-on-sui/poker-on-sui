import { useCallback, useState } from 'react'
import { useGameActions } from './useGameActions'

export function useGameControl(gameAddr: string | undefined) {
  const actions = useGameActions(gameAddr)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartGame = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Starting game...')
      const result = await actions.startGame()
      if (result.ok) return
      console.error('Failed to start game:', result.error)
      setError(result.error)
    } catch (err) {
      console.error('Error starting game:', err)
      setError(err instanceof Error ? err.message : 'Failed to start game')
    } finally {
      setLoading(false)
    }
  }, [actions])

  const handleBet = useCallback(
    async (amount: number) => {
      setLoading(true)
      setError(null)
      try {
        console.log(`Placing bet of ${amount}...`)
        const result = await actions.bet(amount)
        if (result.ok) return
        console.error('Failed to place bet:', result.error)
        setError(result.error)
      } catch (err) {
        console.error('Error placing bet:', err)
        setError(err instanceof Error ? err.message : 'Failed to place bet')
      } finally {
        setLoading(false)
      }
    },
    [actions]
  )

  const handleFold = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Folding...')
      const result = await actions.fold()
      if (result.ok) return
      console.error('Failed to fold:', result.error)
      setError(result.error)
    } catch (err) {
      console.error('Error folding:', err)
      setError(err instanceof Error ? err.message : 'Failed to fold')
    } finally {
      setLoading(false)
    }
  }, [actions])

  const handleCheck = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Checking...')
      const result = await actions.check()
      if (result.ok) return
      console.error('Failed to check:', result.error)
      setError(result.error)
    } catch (err) {
      console.error('Error checking:', err)
      setError(err instanceof Error ? err.message : 'Failed to check')
    } finally {
      setLoading(false)
    }
  }, [actions])

  const handleCall = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Calling...')
      const result = await actions.call()
      if (result.ok) return
      console.error('Failed to call:', result.error)
      setError(result.error)
    } catch (err) {
      console.error('Error calling:', err)
      setError(err instanceof Error ? err.message : 'Failed to call')
    } finally {
      setLoading(false)
    }
  }, [actions])

  const handleRaise = useCallback(
    async (amount: number) => {
      setLoading(true)
      setError(null)
      try {
        console.log(`Raising by ${amount}...`)
        const result = await actions.raise(amount)
        if (result.ok) return
        console.error('Failed to raise:', result.error)
        setError(result.error)
      } catch (err) {
        console.error('Error raising:', err)
        setError(err instanceof Error ? err.message : 'Failed to raise')
      } finally {
        setLoading(false)
      }
    },
    [actions]
  )

  return {
    handleStartGame,
    handleBet,
    handleFold,
    handleCheck,
    handleCall,
    handleRaise,
    loading,
    error,
  }
}
