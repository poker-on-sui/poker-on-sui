import {
  useAccounts,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback, useState } from 'react'
import { useNetworkVariable } from '~/lib/networkConfig'
import { getDictionary } from '~/lib/dictionaries'
import { getGameInfo } from '../queries/getGameInfo'
import { ok, failed, Result } from '~/lib/result'
import { useRouter } from 'next/navigation'

const dict = getDictionary()

export function useGameActions() {
  const [account] = useAccounts()
  const suiClient = useSuiClient()
  const { mutateAsync } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: { showRawEffects: true, showObjectChanges: true },
      }),
  })
  const pokerPackageId = useNetworkVariable('pokerPackageId')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const executeTransaction = useCallback(
    async (transaction: Transaction) => {
      setIsLoading(true)
      try {
        const result = await mutateAsync({ transaction })
        console.log('Transaction executed:', result)
        return ok(result.objectChanges ?? [])
      } catch (error) {
        console.error('Transaction error:', error)
        return failed(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [mutateAsync]
  )

  const createGame = useCallback(
    async (buyIn: number) => {
      try {
        const transaction = new Transaction()

        // Convert buyIn to MIST (1 SUI = 10^9 MIST)
        const buyInMist = Math.floor(buyIn * 1_000_000_000)

        transaction.moveCall({
          target: `${pokerPackageId}::game::create_game`,
          arguments: [transaction.pure.u64(buyInMist)],
        })

        const result = await executeTransaction(transaction)
        if (result.ok) {
          const createdObject = result.data
            .filter(obj => obj.type === 'created')
            .pop()
          if (!createdObject) return failed('No object was created!')
          const gameAddress = createdObject.objectId
          console.log('Game created successfully:', gameAddress)
          return ok(gameAddress)
        }
        return failed('Failed to create game. Transaction failed!')
      } catch (error) {
        console.error('Create game error:', error)
        return failed(
          error instanceof Error ? error.message : 'Failed to create game'
        )
      }
    },
    [pokerPackageId, executeTransaction]
  )

  const joinGame = useCallback(
    async (gameAddr: string): Promise<Result> => {
      if (!gameAddr) return failed(dict.errors.missingGameAddress)
      if (!account) return failed(dict.errors.walletNotConnected)

      const game = await getGameInfo(gameAddr, suiClient)
      if (!game) return failed(dict.errors.gameNotFound)

      if (game.players.some(p => p.fields.addr === account.address)) {
        console.log('Already joined, redirecting to game')
        router.push(`/game?addr=${gameAddr}`)
        return ok()
      }

      try {
        const tx = new Transaction()
        const paymentMist = Math.floor(game.buy_in)
        const [coin] = tx.splitCoins(tx.gas, [paymentMist])
        tx.moveCall({
          target: `${pokerPackageId}::game::join_game`,
          arguments: [tx.object(gameAddr), coin],
        })

        const result = await executeTransaction(tx)
        if (!result.ok) return result

        console.log('Joined game successfully:', gameAddr)
        router.push(`/game?addr=${gameAddr}`)
        return ok()
      } catch (error) {
        console.error('Join game error:', error)
        return failed(
          error instanceof Error ? error.message : 'Failed to join game'
        )
      }
    },
    [account, suiClient, router, pokerPackageId, executeTransaction]
  )

  const startGame = useCallback(
    async (gameAddr: string): Promise<Result> => {
      if (!gameAddr) return failed(dict.errors.missingGameAddress)

      try {
        const tx = new Transaction()
        tx.moveCall({
          target: `${pokerPackageId}::game::start_game`,
          arguments: [tx.object(gameAddr), tx.object.random()],
        })

        const result = await executeTransaction(tx)
        if (!result.ok) return failed(result.error)
        return ok()
      } catch (error) {
        console.error('Start game error:', error)
        return failed(
          error instanceof Error ? error.message : 'Failed to start game'
        )
      }
    },
    [pokerPackageId, executeTransaction]
  )

  // TODO: Implement fold, check, call, bet, raise actions
  const fold = useCallback(() => {}, [])
  const check = useCallback(() => {}, [])
  const call = useCallback(() => {}, [])
  const bet = useCallback((amount: number) => {}, [])
  const raise = useCallback((amount: number) => {}, [])

  return {
    createGame,
    joinGame,
    startGame,
    fold,
    check,
    call,
    bet,
    raise,
    isLoading,
  }
}
