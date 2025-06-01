// import { useSuiClient } from '@mysten/dapp-kit'

import { useGameInfoQuery } from '../queries/getGameInfo'
// import { useEffect } from 'react'
// import { useNetworkVariable } from '../networkConfig'

export function useGameTable(gameAddr: string | undefined) {
  const { data: game, isLoading } = useGameInfoQuery(gameAddr)
  // const pokerPackageId = useNetworkVariable('pokerPackageId')
  // const suiClient = useSuiClient()

  // useEffect(() => {
  //   let unsubscribe: (() => void) | undefined
  //   suiClient
  //     .subscribeEvent({
  //       filter: {
  //         MoveEventModule: {
  //           package: pokerPackageId,
  //           module: 'game',
  //         },
  //       },
  //       onMessage: event => {
  //         console.log('Received event:', event)
  //         refetch()
  //       },
  //     })
  //     .then(e => {
  //       console.log('Subscribed to game events')
  //       unsubscribe = e
  //     })

  //   return () => {
  //     unsubscribe?.()
  //   }
  // }, [suiClient, pokerPackageId, refetch])

  return { game, isLoading }
}
