import { useSuiClientQueries } from '@mysten/dapp-kit'
import { useEffect } from 'react'

export function useGame(addr?: string) {
  const { data, isSuccess, isPending, isError } = useSuiClientQueries({
    queries: addr
      ? [{ method: 'queryEvents', params: { query: { Transaction: addr } } }]
      : [],
    combine: result => {
      return {
        data: result.map(res => res.data),
        isSuccess: result.every(res => res.isSuccess),
        isPending: result.some(res => res.isPending),
        isError: result.some(res => res.isError),
      }
    },
  })

  useEffect(() => {
    console.log('Game data:', data)
  }, [data])

  return { data, isSuccess, isPending, isError }
}
