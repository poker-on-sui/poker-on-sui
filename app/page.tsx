'use client'
import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '../components/ui/dialog'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [gameAddress, setGameAddress] = useState('')

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] relative'>
      {/* Top bar */}
      <div className='flex justify-between items-center p-4'>
        {/* Help icon */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button
              aria-label='Game Rules'
              variant='ghost'
              className='text-2xl font-bold text-cyan-300 hover:text-cyan-400 transition drop-shadow-glow px-3 py-1'
            >
              ?
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-[#181f2a] border border-cyan-700'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent'>
                How to Play
              </DialogTitle>
              <DialogDescription asChild>
                <ul className='list-disc pl-5 space-y-2 text-cyan-100'>
                  <li>
                    Host a new game or join an existing one using the game
                    address.
                  </li>
                  <li>Connect your SUI wallet to participate.</li>
                  <li>
                    Each player receives two cards. Five community cards are
                    dealt face up.
                  </li>
                  <li>Betting rounds: Pre-flop, Flop, Turn, River.</li>
                  <li>
                    Use actions: Check, Call, Raise, Fold, or All-in on your
                    turn.
                  </li>
                  <li>Best five-card hand wins the pot at showdown.</li>
                  <li>
                    All game logic and funds are managed securely on the SUI
                    blockchain.
                  </li>
                </ul>
              </DialogDescription>
              <div className='mt-4 text-sm text-cyan-400'>
                For more details, see the full rules in the documentation.
              </div>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='absolute top-2 right-2 text-cyan-400 hover:text-cyan-200 text-2xl'
              >
                <span aria-hidden>×</span>
                <span className='sr-only'>Close</span>
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        {/* Connect Wallet placeholder */}
        <Button className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-700 rounded shadow text-white font-semibold hover:from-cyan-400 hover:to-blue-600 transition drop-shadow-glow'>
          Connect Wallet
        </Button>
      </div>

      {/* Main content */}
      <div className='flex flex-1 flex-col items-center justify-center'>
        <h1 className='text-4xl font-extrabold mb-8 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow'>
          Welcome to Texas Hold&#39;em Poker
        </h1>
        <div className='flex flex-col gap-6 w-full max-w-xs'>
          <Button className='w-full py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-green-400 hover:to-emerald-600 transition drop-shadow-glow'>
            Host
          </Button>
          <div className='flex flex-col gap-2'>
            <Input
              type='text'
              placeholder='Enter Game Address'
              value={gameAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGameAddress(e.target.value)
              }
              className='w-full px-4 py-2 border border-cyan-700 bg-[#1a2634] text-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-400'
            />
            <Button className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg text-xl font-bold shadow-lg hover:from-blue-500 hover:to-purple-600 transition drop-shadow-glow'>
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
