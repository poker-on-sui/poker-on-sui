import { useGameInfoQuery } from '../queries/getGameInfo'

export function useGameTable(addr?: string) {
  const { data: game, isLoading } = useGameInfoQuery(addr)

  return { game, isLoading }
}
