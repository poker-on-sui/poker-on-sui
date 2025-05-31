import React from 'react'
import GameTable from '~/components/GameTable'

interface Props {
  params: Promise<{
    /*
     * The game address is passed as a parameter in the URL.
     * For example, if the URL is /game/0x1234567890abcdef, then gameAddress will be '0x1234567890abcdef'.
     */
    addr: string
  }>
}

export default async function GamePage({ params }: Props) {
  const { addr } = await params
  return <GameTable gameAddress={addr} />
}
