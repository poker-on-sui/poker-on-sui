'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from './ui/dialog'
import { en } from '~/lib/dictionaries'

export default function GameRules() {
  const [showModal, setShowModal] = useState(false)

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          aria-label='Game Rules'
          variant='ghost'
          className='cursor-pointer text-2xl font-bold text-cyan-300 hover:text-cyan-400 transition drop-shadow-glow px-3 py-1'
        >
          ?
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='bg-[#181f2a] border border-cyan-700'
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent'>
            {en.rules.title}
          </DialogTitle>
          <DialogDescription asChild>
            <ul className='list-disc pl-5 space-y-2 text-cyan-100 text-left'>
              {en.rules.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
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
            className='cursor-pointer absolute top-2 right-2 text-cyan-400 hover:text-cyan-200 text-2xl'
          >
            <span aria-hidden>×</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
