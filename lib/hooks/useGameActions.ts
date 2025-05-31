import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback, useState } from 'react'
import { useNetworkVariable } from '~/lib/networkConfig'
import { getDictionary } from '~/lib/dictionaries'

const dict = getDictionary()

// Action constants from smart contract
enum PlayerAction {
  FOLD = 0,
  CHECK = 1,
  CALL = 2,
  BET = 3,
  RAISE = 4,
}

export interface GameActionResult {
  success: boolean
  error?: string
  transactionDigest?: string
}

export function useGameActions(addr?: string): {
  createGame: (buyIn: number) => Promise<GameActionResult>
  joinGame: (payment: number) => Promise<GameActionResult>
  startGame: () => Promise<GameActionResult>
  fold: () => Promise<GameActionResult>
  check: () => Promise<GameActionResult>
  call: () => Promise<GameActionResult>
  bet: (amount: number) => Promise<GameActionResult>
  raise: (amount: number) => Promise<GameActionResult>
  isLoading: boolean
} {
  const suiClient = useSuiClient()
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await suiClient.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: { showRawEffects: true, showObjectChanges: true },
        }),
    })

  const pokerPackageId = useNetworkVariable('pokerPackageId')
  const [isLoading, setIsLoading] = useState(false)

  const executeTransaction = useCallback(
    async (transaction: Transaction): Promise<GameActionResult> => {
      setIsLoading(true)
      try {
        const result = await signAndExecuteTransaction({ transaction })
        console.log('Transaction executed:', result)

        return {
          success: true,
          transactionDigest: result.digest,
        }
      } catch (error) {
        console.error('Transaction error:', error)
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        }
      } finally {
        setIsLoading(false)
      }
    },
    [signAndExecuteTransaction]
  )

  const createGame = useCallback(
    async (buyIn: number): Promise<GameActionResult> => {
      try {
        const transaction = new Transaction()

        // Convert buyIn to MIST (1 SUI = 10^9 MIST)
        const buyInMist = Math.floor(buyIn * 1_000_000_000)

        transaction.moveCall({
          target: `${pokerPackageId}::game::create_game`,
          arguments: [transaction.pure.u64(buyInMist)],
        })

        return await executeTransaction(transaction)
      } catch (error) {
        console.error('Create game error:', error)
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to create game',
        }
      }
    },
    [pokerPackageId, executeTransaction]
  )

  const joinGame = useCallback(
    async (payment: number): Promise<GameActionResult> => {
      if (!addr) {
        return {
          success: false,
          error: dict.errors.missingGameAddress,
        }
      }

      try {
        const transaction = new Transaction()

        // Convert payment to MIST
        const paymentMist = Math.floor(payment * 1_000_000_000)

        // Split coins for payment
        const [coin] = transaction.splitCoins(transaction.gas, [paymentMist])

        transaction.moveCall({
          target: `${pokerPackageId}::game::join_game`,
          arguments: [transaction.object(addr), coin],
        })

        return await executeTransaction(transaction)
      } catch (error) {
        console.error('Join game error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to join game',
        }
      }
    },
    [addr, pokerPackageId, executeTransaction]
  )

  const startGame = useCallback(async (): Promise<GameActionResult> => {
    if (!addr) {
      return {
        success: false,
        error: dict.errors.missingGameAddress,
      }
    }

    try {
      const transaction = new Transaction()

      transaction.moveCall({
        target: `${pokerPackageId}::game::start_game`,
        arguments: [
          transaction.object(addr),
          transaction.object('0x8'), // Random object ID
        ],
      })

      return await executeTransaction(transaction)
    } catch (error) {
      console.error('Start game error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start game',
      }
    }
  }, [addr, pokerPackageId, executeTransaction])

  const playerAction = useCallback(
    async (
      action: PlayerAction,
      amount: number = 0
    ): Promise<GameActionResult> => {
      if (!addr) {
        return {
          success: false,
          error: dict.errors.missingGameAddress,
        }
      }

      try {
        const transaction = new Transaction()

        // Convert amount to MIST for bet/raise actions
        const amountMist = Math.floor(amount * 1_000_000_000)

        transaction.moveCall({
          target: `${pokerPackageId}::game::player_action`,
          arguments: [
            transaction.object(addr),
            transaction.pure.u8(action),
            transaction.pure.u64(amountMist),
          ],
        })

        return await executeTransaction(transaction)
      } catch (error) {
        console.error('Player action error:', error)
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to execute action',
        }
      }
    },
    [addr, pokerPackageId, executeTransaction]
  )

  const fold = useCallback(
    () => playerAction(PlayerAction.FOLD),
    [playerAction]
  )

  const check = useCallback(
    () => playerAction(PlayerAction.CHECK),
    [playerAction]
  )

  const call = useCallback(
    () => playerAction(PlayerAction.CALL),
    [playerAction]
  )

  const bet = useCallback(
    (amount: number) => playerAction(PlayerAction.BET, amount),
    [playerAction]
  )

  const raise = useCallback(
    (amount: number) => playerAction(PlayerAction.RAISE, amount),
    [playerAction]
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
