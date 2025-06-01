import { useSuiClientInfiniteQuery } from '@mysten/dapp-kit'

import { useGameInfoQuery } from '../queries/getGameInfo'

export function useGameTable(addr?: string) {
  const { data: game, isLoading } = useGameInfoQuery(addr)
  const history = useGameHistory(addr)

  return { game, history, isLoading }
}

function useGameHistory(addr: string | undefined) {
  return useSuiClientInfiniteQuery(
    'queryEvents',
    { query: { Transaction: addr! } },
    { enabled: !!addr }
  )
}
