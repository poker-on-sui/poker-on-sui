import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useNetworkVariable } from '../networkConfig'
import { en } from '../dictionaries'
import { isValidSuiAddress } from '../utils'
import { useGameActions } from './useGameActions'

export function useGameLobby() {
  return {
    ...useHostGame(),
    ...useJoinGame(),
  }
}

function useHostGame() {
  const { createGame } = useGameActions()
  const [createError, setCreateError] = useState('')
  const pokerPackageId = useNetworkVariable('pokerPackageId')
  const router = useRouter()

  const handleCreateGame = useCallback(async () => {
    if (!pokerPackageId) {
      console.error('Poker package ID is not set in network config')
      return
    }
    const result = await createGame()
    if (result.ok) {
      console.log('Game created successfully:', result.data)
      router.push(`/game?addr=${result.data}`)
    } else {
      setCreateError(result.error)
    }
  }, [createGame, pokerPackageId, router])

  return { handleCreateGame, createError }
}
export function useJoinGame() {
  const [gameAddress, setGameAddress] = useState('')
  const [joinError, setJoinError] = useState('')
  const { joinGame } = useGameActions()
  const router = useRouter()

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim()
    setGameAddress(address)
    if (isValidSuiAddress(address)) setJoinError('')
    else setJoinError(en.lobby.invalidSuiAddress)
  }
  // const suiClient = useSuiClient()
  // const { mutateAsync } = useSignAndExecuteTransaction()

  const handleJoinGame = useCallback(async (): Promise<void> => {
    console.log('Joining game at address:', gameAddress)
    const result = await joinGame(gameAddress)
    if (result.ok) {
      console.log('Successfully joined game:', result.data)
      router.push(`/game?addr=${gameAddress}`)
    } else {
      console.error('Failed to join game:', result.error)
      setJoinError(result.error)
    }
  }, [gameAddress, joinGame, router])

  return {
    handleJoinGame,
    gameAddress,
    joinError,
    handleAddressChange,
  }
}
