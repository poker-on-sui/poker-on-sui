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
  const { mutateAsync } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      }),
  })

  const createGame = async (): Promise<void> => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${pokerPackageId}::game::create_game`,
      arguments: [tx.pure.u64(defaultGameConfig.buy_in)],
    })
    const { objectChanges } = await mutateAsync({ transaction: tx })
    if (!objectChanges || objectChanges.length === 0) {
      console.error('Failed to create game: No object changed!')
      return
    }

    console.log('Game created, objectChanges:', objectChanges)
    const createdObjectId = objectChanges
      ?.map(
        o =>
          o.type === 'created' &&
          o.objectType === `${pokerPackageId}::game::PokerGame` &&
          o.objectId
      )
      .filter(Boolean)[0]

    if (!createdObjectId) {
      console.error('Failed to create game: No Game ID found')
      return
    }
    console.log('Game created with ID:', createdObjectId)

    router.push(`/game/?addr=${createdObjectId}`)
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
