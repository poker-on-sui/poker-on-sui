import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: process.env.NODE_ENV === 'development' },
}

export default nextConfig
