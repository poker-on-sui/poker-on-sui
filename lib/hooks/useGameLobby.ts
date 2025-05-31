import { useState } from 'react'
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { useRouter } from 'next/navigation'

import { useNetworkVariable } from '../networkConfig'
import { en } from '../dictionaries'
import { isValidSuiAddress } from '../utils'
import { Transaction } from '@mysten/sui/transactions'

export function useGameLobby() {
  return {
    ...useHostGame(),
    ...useJoinGame(),
  }
}

const defaultGameConfig = {
  buy_in: 1000000, // 1 SUI
}

function useHostGame() {
  const pokerPackageId = useNetworkVariable('pokerPackageId')
  const suiClient = useSuiClient()
  const router = useRouter()
  const { mutateAsync } = useSignAndExecuteTransaction()

  const createGame = async (): Promise<void> => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${pokerPackageId}::game::create_game`,
      arguments: [tx.pure.u64(defaultGameConfig.buy_in)],
    })
    const signed = await mutateAsync({ transaction: tx })

    const result = await suiClient.waitForTransaction(signed)
    console.log('Game created:', result)

    router.push(`/game/?addr=${result.digest}`)
  }

  return { createGame }
}

export function useJoinGame() {
  const [gameAddress, setGameAddress] = useState('')
  const [addressError, setAddressError] = useState('')
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim()
    setGameAddress(address)
    if (isValidSuiAddress(address)) {
      setAddressError('')
    } else {
      setAddressError(en.lobby.invalidSuiAddress)
    }
  }
  // const suiClient = useSuiClient()
  // const { mutateAsync } = useSignAndExecuteTransaction()

  const joinGame = (): void => {
    console.log('Joining game at address:', gameAddress)
    // WIP
  }

  return { joinGame, gameAddress, addressError, handleAddressChange }
}
