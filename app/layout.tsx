import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import '@mysten/dapp-kit/dist/index.css'
import './globals.css'

import { en } from '~/lib/dictionaries'
import { AppLayout } from '~/components/AppLayout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
}

interface Props {
  readonly children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
