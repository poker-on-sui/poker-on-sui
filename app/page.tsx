'use client'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { useAccounts } from '@mysten/dapp-kit'

import GameLobby from '~/components/GameLobby'
import WalletConnectionPrompt from '~/components/WalletConnectionPrompt'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'
import iconPng from './icon.png'

export default function HomePage() {
  const [account] = useAccounts()

  return (
    <div className='min-h-screen'>
      <AnimatePresence mode='wait'>
        {!account ? (
          <motion.div
            key='wallet-prompt'
            className='min-h-screen flex flex-1 flex-col items-center justify-center'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <WalletConnectionPrompt size='large' />
          </motion.div>
        ) : (
          <motion.div
            key='game-lobby'
            className='min-h-screen flex flex-1 flex-col items-center justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              layoutId='poker-icon'
              initial={{ opacity: 0, scale: 0.8, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={iconPng}
                alt='Poker on SUI'
                className='drop-shadow-2xl size-[320px]'
                priority
              />
            </motion.div>
            <motion.h1
              className='text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            >
              {en.home.title}
            </motion.h1>
            <motion.div
              className='mb-8 flex items-center justify-center opacity-80'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            >
              <motion.span
                className='text-white italic'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
              >
                All-in-
              </motion.span>
              <motion.div
                initial={{ opacity: 0, x: 10, rotate: -10 }}
                animate={{ opacity: 0.8, x: 0, rotate: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.8 }}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <Image
                  src={suiIconSvg}
                  alt='SUI'
                  unoptimized
                  className='opacity-80 w-[12px] h-[16px]'
                />
              </motion.div>
            </motion.div>
            <GameLobby />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
