'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ConnectButton } from '@mysten/dapp-kit'

import iconPng from '~/app/icon.png'
import suiIconSvg from '~/assets/sui-icon-white.svg'
import { en } from '~/lib/dictionaries'

export default function WalletConnectionPrompt() {
  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center">
      {/* Logo and branding */}
      <div className="flex flex-col items-center justify-center mb-8">
        <motion.div
          layoutId="poker-icon"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Image
            src={iconPng}
            alt="Poker on SUI"
            className={`drop-shadow-2xl mb-4 size-[120px]`}
            priority
          />
        </motion.div>
        <h1
          className={`font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-glow mb-2 text-3xl`}
        >
          {en.home.title}
        </h1>
        <div className="flex items-center justify-center opacity-80 mb-8">
          <span className={`text-white italic text-lg`}>All-in-</span>
          <Image
            src={suiIconSvg}
            alt="SUI"
            unoptimized
            className={`opacity-80 w-[12px] h-[15px]`}
          />
        </div>
      </div>

      {/* Connect wallet message */}
      <div className="text-center mb-8 max-w-md">
        <h2 className={`text-white font-semibold mb-2 text-xl`}>
          Ready to Play?
        </h2>
        <p className={`text-gray-300 leading-relaxed text-base`}>
          {en.errors.walletNotConnected} to join the poker table and start
          playing Texas Hold&apos;em on the SUI blockchain.
        </p>
      </div>

      {/* Connect button */}
      <div className="mb-4">
        <ConnectButton />
      </div>

      {/* Additional info */}
      <p className={`text-gray-400 text-center max-w-sm text-sm`}>
        Your wallet will be used to manage your chips and participate in games
        securely on the blockchain.
      </p>
    </div>
  )
}
