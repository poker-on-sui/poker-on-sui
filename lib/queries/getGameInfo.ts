import { useSuiClientQuery } from '@mysten/dapp-kit'
import { SuiClient } from '@mysten/sui/client'
import { MovePokerGameSchema } from '../models/MovePokerGameSchema'

export async function getGameInfo(gameAddress: string, client: SuiClient) {
  const { data, error } = await client.getObject({
    id: gameAddress,
    options: { showContent: true, showType: true },
  })
  if (error) throw error
  const content = data?.content
  if (!content || content.dataType !== 'moveObject') return
  return MovePokerGameSchema.parse(content.fields)
}

export const useGameInfoQuery = (addr?: string) =>
  useSuiClientQuery(
    'getObject',
    { id: addr!, options: { showContent: true } },
    {
      enabled: !!addr,
      select({ data }) {
        const content = data?.content
        if (!content || content.dataType !== 'moveObject') return
        return MovePokerGameSchema.parse(content.fields)
      },
    }
  )
