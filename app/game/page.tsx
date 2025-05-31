'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GameTable from '~/components/GameTable'

function GamePageContent() {
  const searchParams = useSearchParams()
  const [gameAddress, setGameAddress] = useState<string | undefined>()

  useEffect(() => {
    const addr = searchParams.get('addr')
    if (addr) setGameAddress(addr)
  }, [searchParams])

  return <GameTable gameAddress={gameAddress} />
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center h-screen text-white'>
          Loading...
        </div>
      }
    >
      <GamePageContent />
    </Suspense>
  )
}
