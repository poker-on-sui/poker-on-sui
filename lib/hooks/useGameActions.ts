import {
  useAccounts,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback, useState } from 'react'
import { useNetworkVariable } from '~/lib/networkConfig'
import { getDictionary } from '~/lib/dictionaries'
import { getGameInfo, useGameInfoQuery } from '../queries/getGameInfo'
import { ok, failed, Result } from '~/lib/result'
import { PokerGameState } from '../models/MovePokerGameSchema'
import { formatMist } from '../format-mist'

const dict = getDictionary()

const DEFAULT_BUY_IN = 100_000_000 // 0.1 SUI

export function useGameActions(gameAddr: string | undefined) {
  const [account] = useAccounts()
  const suiClient = useSuiClient()
  const { data: currentGame } = useGameInfoQuery(gameAddr)
  const { mutateAsync: mutateWithObjectChangesAsync } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await suiClient.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: { showRawEffects: true, showObjectChanges: true },
        }),
    })
  const { mutateAsync } = useSignAndExecuteTransaction()
  const pokerPackageId = useNetworkVariable('pokerPackageId')
  const [isLoading, setIsLoading] = useState(false)

  const executeTransactionWithObjectChanges = useCallback(
    async (transaction: Transaction) => {
      setIsLoading(true)
      try {
        const result = await mutateWithObjectChangesAsync({ transaction })
        console.log('Transaction executed:', result)
        if (result.errors?.length) return failed(result.errors.join(', '))
        return ok(result)
      } catch (error) {
        console.error('Transaction error:', error)
        return failed(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [mutateWithObjectChangesAsync]
  )
  const executeTransaction = useCallback(
    async (transaction: Transaction) => {
      setIsLoading(true)
      try {
        const result = await mutateAsync({ transaction })
        console.log('Transaction executed:', result)
        return ok(result.digest)
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
    async (buyIn: number = DEFAULT_BUY_IN) => {
      console.log(
        `Creating game with buy-in: ${buyIn} MIST (${formatMist(buyIn)} SUI)`
      )
      try {
        const tx = new Transaction()
        const [coin] = tx.splitCoins(tx.gas, [buyIn])
        tx.moveCall({
          target: `${pokerPackageId}::game::create_game`,
          arguments: [coin],
        })
        const result = await executeTransactionWithObjectChanges(tx)
        if (result.ok) {
          const createdObject = (result.data.objectChanges || [])
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
    [pokerPackageId, executeTransactionWithObjectChanges]
  )

  const joinGame = useCallback(
    async (gameAddr: string): Promise<Result> => {
      if (!gameAddr) return failed(dict.errors.missingGameAddress)
      if (!account) return failed(dict.errors.walletNotConnected)

      const game = await getGameInfo(gameAddr, suiClient)
      if (!game) return failed(dict.errors.gameNotFound)

      if (game.players.some(p => p.id === account.address)) return ok()

      try {
        const tx = new Transaction()
        const paymentMist = Math.floor(game.buyInAmount)
        const [coin] = tx.splitCoins(tx.gas, [paymentMist])
        tx.moveCall({
          target: `${pokerPackageId}::game::join_game`,
          arguments: [tx.object(gameAddr), coin],
        })

        const result = await executeTransactionWithObjectChanges(tx)
        if (!result.ok) return result

        // Wait for transaction to be confirmed
        await suiClient.waitForTransaction({ digest: result.data.digest })

        console.log('Joined game successfully:', gameAddr)
        return ok()
      } catch (error) {
        console.error('Join game error:', error)
        return failed(
          error instanceof Error ? error.message : 'Failed to join game'
        )
      }
    },
    [account, suiClient, pokerPackageId, executeTransactionWithObjectChanges]
  )

  const startGame = useCallback(async (): Promise<Result> => {
    if (!currentGame) return failed(dict.errors.gameNotFound)

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${pokerPackageId}::game::start_game`,
        arguments: [tx.object(currentGame.id), tx.object.random()],
      })

      const result = await executeTransactionWithObjectChanges(tx)

      if (!result.ok) return failed(result.error)

      // Wait for transaction to be confirmed
      await suiClient.waitForTransaction({ digest: result.data.digest })
      return ok()
    } catch (error) {
      console.error('Start game error:', error)
      return failed(
        error instanceof Error ? error.message : 'Failed to start game'
      )
    }
  }, [
    currentGame,
    pokerPackageId,
    executeTransactionWithObjectChanges,
    suiClient,
  ])

  // TODO: Implement fold, check, call, bet, raise actions
  const fold = useCallback(() => {
    if (!currentGame) return failed(dict.errors.gameNotFound)
    if (!account) return failed(dict.errors.walletNotConnected)
    if (
      currentGame.status === PokerGameState.WAITING_FOR_PLAYERS ||
      currentGame.status === PokerGameState.GAME_OVER
    )
      return failed(dict.errors.gameNotFound)

    const tx = new Transaction()
    tx.moveCall({
      target: `${pokerPackageId}::game::fold`,
      arguments: [tx.object(currentGame.id)],
    })
    return executeTransaction(tx)
  }, [account, currentGame, executeTransaction, pokerPackageId])
  const check = useCallback(() => {
    if (!currentGame) return failed(dict.errors.gameNotFound)
    if (!account) return failed(dict.errors.walletNotConnected)
    if (
      currentGame.status === PokerGameState.WAITING_FOR_PLAYERS ||
      currentGame.status === PokerGameState.GAME_OVER
    )
      return failed(dict.errors.gameNotFound)

    const tx = new Transaction()
    tx.moveCall({
      target: `${pokerPackageId}::game::check`,
      arguments: [tx.object(currentGame.id)],
    })
    return executeTransaction(tx)
  }, [account, currentGame, executeTransaction, pokerPackageId])
  const call = useCallback(() => {
    if (!currentGame) return failed(dict.errors.gameNotFound)
    if (!account) return failed(dict.errors.walletNotConnected)
    if (
      currentGame.status === PokerGameState.WAITING_FOR_PLAYERS ||
      currentGame.status === PokerGameState.GAME_OVER
    )
      return failed(dict.errors.gameNotFound)

    const tx = new Transaction()
    tx.moveCall({
      target: `${pokerPackageId}::game::call`,
      arguments: [tx.object(currentGame.id)],
    })
    return executeTransaction(tx)
  }, [account, currentGame, executeTransaction, pokerPackageId])
  const bet = useCallback(
    (amount: number) => {
      if (!currentGame) return failed(dict.errors.gameNotFound)
      if (!account) return failed(dict.errors.walletNotConnected)
      if (
        currentGame.status === PokerGameState.WAITING_FOR_PLAYERS ||
        currentGame.status === PokerGameState.GAME_OVER
      )
        return failed(dict.errors.gameNotFound)

      const tx = new Transaction()
      tx.moveCall({
        target: `${pokerPackageId}::game::bet`,
        arguments: [tx.object(currentGame.id), tx.pure.u64(amount)],
      })
      return executeTransaction(tx)
    },
    [account, currentGame, executeTransaction, pokerPackageId]
  )
  const raise = useCallback(
    (amount: number) => {
      if (!currentGame) return failed(dict.errors.gameNotFound)
      if (!account) return failed(dict.errors.walletNotConnected)
      if (
        currentGame.status === PokerGameState.WAITING_FOR_PLAYERS ||
        currentGame.status === PokerGameState.GAME_OVER
      )
        return failed(dict.errors.gameNotFound)

      const tx = new Transaction()
      tx.moveCall({
        target: `${pokerPackageId}::game::raise`,
        arguments: [tx.object(currentGame.id), tx.pure.u64(amount)],
      })
      return executeTransaction(tx)
    },
    [account, currentGame, executeTransaction, pokerPackageId]
  )

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
